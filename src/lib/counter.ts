/**
 * Redis usage counter with circuit breaker and in-memory retry queue.
 *
 * Increments a counter keyed by tool name + date on every MCP tool call.
 * Key format: "dashlint:v2:calls:{toolName}:{YYYY-MM-DD}".
 *
 * Circuit Breaker: After 5 consecutive failures, opens the circuit for 60s.
 * During open state, increments are queued in memory (max 500 entries).
 * When the circuit half-opens, queued increments are flushed first.
 *
 * Falls back gracefully if Redis is not configured (local dev).
 */

import { Redis as UpstashRedis } from "@upstash/redis";
import IoRedis from "ioredis";

interface RedisAdapter {
  incr(key: string): Promise<number>;
  scan(cursor: string, pattern: string): Promise<[string, string[]]>;
  get(key: string): Promise<number | null>;
}

// ── Redis Client ────────────────────────────────────────────────────────────

let cachedAdapter: RedisAdapter | null = null;
let ioRedisInstance: IoRedis | null = null;

function getClient(): RedisAdapter | null {
  if (cachedAdapter) return cachedAdapter;

  try {
    // 1. Native Redis connection URL (redis:// or rediss://)
    const rawUrl =
      process.env.STORAGE_REDIS_URL ||
      process.env.STORAGE_URL ||
      process.env.REDIS_URL;

    if (rawUrl && (rawUrl.startsWith("redis://") || rawUrl.startsWith("rediss://"))) {
      if (!ioRedisInstance) {
        ioRedisInstance = new IoRedis(rawUrl, {
          maxRetriesPerRequest: 1,
          lazyConnect: true,
          connectTimeout: 5000,
          enableReadyCheck: false,
        });
      }
      cachedAdapter = {
        incr: (key: string) => ioRedisInstance!.incr(key),
        scan: async (cursor: string, pattern: string) => {
          const res = await ioRedisInstance!.scan(cursor, "MATCH", pattern, "COUNT", 100);
          return [res[0], res[1]];
        },
        get: async (key: string) => {
          const val = await ioRedisInstance!.get(key);
          return val !== null ? parseInt(val, 10) : null;
        },
      };
      return cachedAdapter;
    }

    // 2. Upstash HTTP REST connection (https://)
    const restUrl =
      process.env.STORAGE_REST_API_URL ||
      process.env.UPSTASH_REDIS_REST_URL ||
      process.env.KV_REST_API_URL;
    const restToken =
      process.env.STORAGE_REST_API_TOKEN ||
      process.env.UPSTASH_REDIS_REST_TOKEN ||
      process.env.KV_REST_API_TOKEN;

    if (restUrl && restToken && restUrl.startsWith("https://")) {
      const upstash = new UpstashRedis({ url: restUrl, token: restToken });
      cachedAdapter = {
        incr: (key: string) => upstash.incr(key),
        scan: async (cursor: string, pattern: string) => {
          const [next, keys] = await upstash.scan(cursor, { match: pattern, count: 100 });
          return [next, keys];
        },
        get: async (key: string) => {
          const val = await upstash.get<number>(key);
          return val !== null ? Number(val) : null;
        },
      };
      return cachedAdapter;
    }
  } catch {
    // Not configured
  }

  return null;
}

// ── Circuit Breaker ─────────────────────────────────────────────────────────

const FAILURE_THRESHOLD = 5;
const COOLDOWN_MS = 60_000; // 60 seconds
const MAX_QUEUE_SIZE = 500;

let consecutiveFailures = 0;
let circuitOpenedAt = 0;
let lastSuccessAt = 0;
const retryQueue: string[] = [];

type CircuitState = "closed" | "open" | "half-open";

function getCircuitState(): CircuitState {
  if (consecutiveFailures < FAILURE_THRESHOLD) return "closed";
  const elapsed = Date.now() - circuitOpenedAt;
  if (elapsed < COOLDOWN_MS) return "open";
  return "half-open";
}

function recordSuccess(): void {
  consecutiveFailures = 0;
  lastSuccessAt = Date.now();
}

function recordFailure(): void {
  consecutiveFailures++;
  if (consecutiveFailures >= FAILURE_THRESHOLD && circuitOpenedAt < lastSuccessAt) {
    circuitOpenedAt = Date.now();
    console.warn(
      `[dashlint] Circuit breaker OPEN — ${consecutiveFailures} consecutive Redis failures. Cooling down for ${COOLDOWN_MS / 1000}s.`
    );
  }
}

async function flushRetryQueue(): Promise<void> {
  const client = getClient();
  if (!client || retryQueue.length === 0) return;

  const batch = retryQueue.splice(0, 50); // flush up to 50 at a time
  for (const key of batch) {
    try {
      await client.incr(key);
    } catch {
      // Re-queue failed items if under limit
      if (retryQueue.length < MAX_QUEUE_SIZE) {
        retryQueue.push(key);
      }
      return; // stop flushing on first failure
    }
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Increment the call counter for a tool.
 * Safe to call in any environment — silently no-ops if Redis isn't wired up.
 * Uses circuit breaker to avoid hammering a dead Redis.
 */
export async function incrementCounter(toolName: string): Promise<void> {
  try {
    const client = getClient();
    if (!client) return;

    const today = new Date().toISOString().slice(0, 10);
    const key = `dashlint:v2:calls:${toolName}:${today}`;
    const state = getCircuitState();

    if (state === "open") {
      // Circuit is open — queue the increment for later
      if (retryQueue.length < MAX_QUEUE_SIZE) {
        retryQueue.push(key);
      }
      return;
    }

    if (state === "half-open") {
      // Try flushing queued items first
      await flushRetryQueue();
    }

    await client.incr(key);
    recordSuccess();

    // If we recovered, flush any remaining queued items
    if (retryQueue.length > 0) {
      // Fire-and-forget flush
      flushRetryQueue().catch(() => {});
    }
  } catch {
    recordFailure();
    // Queue the failed increment
    const today = new Date().toISOString().slice(0, 10);
    const key = `dashlint:v2:calls:${toolName}:${today}`;
    if (retryQueue.length < MAX_QUEUE_SIZE) {
      retryQueue.push(key);
    }
  }
}

/**
 * Read total calls for a tool across all dates, or for a specific date.
 */
export async function getCallCount(
  toolName?: string,
  date?: string
): Promise<Record<string, number>> {
  try {
    const client = getClient();
    if (!client) return {};

    const state = getCircuitState();
    if (state === "open") return {};

    const pattern = toolName
      ? date
        ? `dashlint:v2:calls:${toolName}:${date}`
        : `dashlint:v2:calls:${toolName}:*`
      : `dashlint:v2:calls:*`;

    const keys: string[] = [];
    let cursor = "0";
    do {
      const [nextCursor, batch] = await client.scan(cursor, pattern);
      cursor = nextCursor;
      keys.push(...batch);
    } while (cursor !== "0");

    const result: Record<string, number> = {};
    for (const key of keys) {
      const val = await client.get(key);
      if (val !== null) result[key] = val;
    }

    recordSuccess();
    return result;
  } catch {
    recordFailure();
    return {};
  }
}

/**
 * Returns the current health status of the Redis counter system.
 * Used by the /api/health endpoint.
 */
export function getCounterHealth(): {
  status: "healthy" | "degraded" | "unavailable";
  circuitState: CircuitState;
  consecutiveFailures: number;
  queuedIncrements: number;
  configured: boolean;
} {
  const client = getClient();
  const state = getCircuitState();
  return {
    status: !client ? "unavailable" : state === "open" ? "degraded" : "healthy",
    circuitState: state,
    consecutiveFailures,
    queuedIncrements: retryQueue.length,
    configured: client !== null,
  };
}
