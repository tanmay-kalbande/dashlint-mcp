/**
 * Rate Limiter for DashLint MCP Server.
 *
 * Implements a sliding window rate limiter supporting both:
 * 1. Distributed Redis counter via Upstash REST (if configured)
 * 2. In-memory fallback sliding window with automated pruning (local dev / fallback)
 *
 * Provides protection against abuse, runaway assistant retry loops, and DoS.
 */

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

// In-memory fallback store
interface MemoryEntry {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, MemoryEntry>();

// Periodic cleanup of stale memory entries (every 2 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore.entries()) {
      if (now > entry.resetTime) {
        memoryStore.delete(key);
      }
    }
  }, 120_000);
}

/**
 * Check rate limit for a client identifier (IP or token).
 *
 * @param identifier Unique key (e.g. IP address or subnet)
 * @param limit Maximum requests allowed in the window
 * @param windowSeconds Duration of the rate limit window in seconds
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const windowMs = windowSeconds * 1000;
  const now = Date.now();

  // 1. Try Upstash Redis if configured
  const restUrl =
    process.env.STORAGE_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL;
  const restToken =
    process.env.STORAGE_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;

  if (restUrl && restToken && restUrl.startsWith("https://")) {
    try {
      const windowKey = Math.floor(now / windowMs);
      const redisKey = `dashlint:ratelimit:${identifier}:${windowKey}`;

      // Increment in Redis via REST
      const incrRes = await fetch(`${restUrl}/incr/${encodeURIComponent(redisKey)}`, {
        headers: { Authorization: `Bearer ${restToken}` },
        signal: AbortSignal.timeout(1500),
      });

      if (incrRes.ok) {
        const data = (await incrRes.json()) as { result: number };
        const count = data.result;

        // Set expiry if first request in window
        if (count === 1) {
          fetch(`${restUrl}/expire/${encodeURIComponent(redisKey)}/${windowSeconds + 2}`, {
            headers: { Authorization: `Bearer ${restToken}` },
          }).catch(() => {});
        }

        const remaining = Math.max(0, limit - count);
        const resetSeconds = Math.ceil((windowMs - (now % windowMs)) / 1000);

        return {
          allowed: count <= limit,
          limit,
          remaining,
          resetSeconds,
        };
      }
    } catch {
      // Fall through to in-memory on Redis error or timeout
    }
  }

  // 2. In-memory fallback
  const entry = memoryStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    memoryStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetSeconds: windowSeconds,
    };
  }

  entry.count++;
  const allowed = entry.count <= limit;
  const remaining = Math.max(0, limit - entry.count);
  const resetSeconds = Math.max(1, Math.ceil((entry.resetTime - now) / 1000));

  return {
    allowed,
    limit,
    remaining,
    resetSeconds,
  };
}
