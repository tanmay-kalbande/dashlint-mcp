/**
 * Webhook notification system for DashLint MCP server.
 *
 * Stores webhook subscriptions in Redis and provides methods to
 * register, unregister, list, and dispatch notifications.
 *
 * Notification types:
 * - "new_domain_pack" — A new domain pack has been added
 * - "breaking_change"  — Breaking changes in a new major version
 * - "server_status"    — Server maintenance or status updates
 * - "new_feature"      — New tools or capabilities added
 *
 * Subscriptions are stored as Redis hash entries:
 *   dashlint:webhooks:{id} => { url, events, createdAt, label }
 *
 * Falls back gracefully if Redis is not configured.
 */

import { Redis as UpstashRedis } from "@upstash/redis";

// ── Types ───────────────────────────────────────────────────────────────────

export type WebhookEvent =
  | "new_domain_pack"
  | "breaking_change"
  | "server_status"
  | "new_feature";

export const VALID_EVENTS: WebhookEvent[] = [
  "new_domain_pack",
  "breaking_change",
  "server_status",
  "new_feature",
];

export interface WebhookSubscription {
  id: string;
  url: string;
  events: WebhookEvent[];
  label?: string;
  createdAt: string;
}

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: {
    title: string;
    message: string;
    version?: string;
    url?: string;
  };
}

// ── Redis Client (reuses Upstash only — webhooks need hash ops) ─────────

let webhookRedis: UpstashRedis | null = null;

function getWebhookRedis(): UpstashRedis | null {
  if (webhookRedis) return webhookRedis;

  const restUrl =
    process.env.STORAGE_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL;
  const restToken =
    process.env.STORAGE_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;

  if (restUrl && restToken && restUrl.startsWith("https://")) {
    webhookRedis = new UpstashRedis({ url: restUrl, token: restToken });
    return webhookRedis;
  }

  return null;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
  return "wh_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const KEY_PREFIX = "dashlint:webhooks:";

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Register a new webhook subscription.
 * Returns the created subscription with its generated ID.
 */
export async function registerWebhook(
  url: string,
  events: WebhookEvent[],
  label?: string
): Promise<WebhookSubscription | null> {
  try {
    const redis = getWebhookRedis();
    if (!redis) return null;

    // Validate URL
    new URL(url); // throws if invalid

    // Validate events
    const validEvents = events.filter((e) => VALID_EVENTS.includes(e));
    if (validEvents.length === 0) return null;

    const sub: WebhookSubscription = {
      id: generateId(),
      url,
      events: validEvents,
      label,
      createdAt: new Date().toISOString(),
    };

    await redis.set(KEY_PREFIX + sub.id, JSON.stringify(sub));
    return sub;
  } catch {
    console.warn("[dashlint] Webhook registration failed (non-fatal)");
    return null;
  }
}

/**
 * Unregister a webhook subscription by ID.
 */
export async function unregisterWebhook(id: string): Promise<boolean> {
  try {
    const redis = getWebhookRedis();
    if (!redis) return false;
    const deleted = await redis.del(KEY_PREFIX + id);
    return deleted > 0;
  } catch {
    return false;
  }
}

/**
 * List all registered webhook subscriptions.
 */
export async function listWebhooks(): Promise<WebhookSubscription[]> {
  try {
    const redis = getWebhookRedis();
    if (!redis) return [];

    const keys: string[] = [];
    let cursor = 0;
    do {
      const [next, batch] = await redis.scan(cursor, {
        match: KEY_PREFIX + "*",
        count: 100,
      });
      cursor = next;
      keys.push(...batch);
    } while (cursor !== 0);

    const subs: WebhookSubscription[] = [];
    for (const key of keys) {
      const raw = await redis.get<string>(key);
      if (raw) {
        try {
          subs.push(typeof raw === "string" ? JSON.parse(raw) : raw);
        } catch {
          // skip malformed entries
        }
      }
    }

    return subs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

/**
 * Dispatch a notification to all subscriptions matching the event.
 * Returns the number of webhooks notified (not necessarily delivered).
 */
export async function dispatchWebhook(
  payload: WebhookPayload
): Promise<{ sent: number; failed: number }> {
  const subs = await listWebhooks();
  const matching = subs.filter((s) =>
    s.events.includes(payload.event)
  );

  let sent = 0;
  let failed = 0;

  for (const sub of matching) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10_000);

      await fetch(sub.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "DashLint-Webhook/1.0",
          "X-DashLint-Event": payload.event,
          "X-DashLint-Webhook-Id": sub.id,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);
      sent++;
    } catch {
      failed++;
    }
  }

  return { sent, failed };
}
