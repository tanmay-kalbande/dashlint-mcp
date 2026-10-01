/**
 * Redis usage counter supporting both standard Redis (ioredis) and Upstash REST.
 *
 * Increments a counter keyed by tool name + date on every MCP tool call.
 * Key format: "dashlint:v2:calls:{toolName}:{YYYY-MM-DD}".
 * The v2 namespace starts clean after the dashboard-creation MCP redesign;
 * historical calls to retired tools remain stored but are excluded from stats.
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

/**
 * Increment the call counter for a tool.
 * Safe to call in any environment — silently no-ops if Redis isn't wired up.
 */
export async function incrementCounter(toolName: string): Promise<void> {
  try {
    const client = getClient();
    if (!client) return;
    const today = new Date().toISOString().slice(0, 10);
    const key = `dashlint:v2:calls:${toolName}:${today}`;
    await client.incr(key);
  } catch {
    console.warn("[dashlint] Redis counter increment failed (non-fatal)");
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

    return result;
  } catch {
    console.warn("[dashlint] Redis read failed (non-fatal)");
    return {};
  }
}
