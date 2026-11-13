import { NextRequest, NextResponse } from "next/server";
import {
  registerWebhook,
  unregisterWebhook,
  listWebhooks,
  VALID_EVENTS,
  type WebhookEvent,
} from "@/lib/webhooks";

/**
 * Webhook registration API.
 *
 * POST /api/webhooks — Register a new webhook
 *   Body: { url: string, events: WebhookEvent[], label?: string }
 *
 * GET /api/webhooks — List all registered webhooks (requires STATS_API_TOKEN)
 *
 * DELETE /api/webhooks?id=wh_xxx — Unregister a webhook (requires STATS_API_TOKEN)
 */

function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const configuredToken = process.env.STATS_API_TOKEN;
  return !!(
    configuredToken &&
    authHeader?.startsWith("Bearer ") &&
    authHeader.slice(7) === configuredToken
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.url || typeof body.url !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'url' field" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.events) || body.events.length === 0) {
      return NextResponse.json(
        {
          error: "Missing or empty 'events' array",
          validEvents: VALID_EVENTS,
        },
        { status: 400 }
      );
    }

    const invalidEvents = body.events.filter(
      (e: string) => !VALID_EVENTS.includes(e as WebhookEvent)
    );
    if (invalidEvents.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid event(s): ${invalidEvents.join(", ")}`,
          validEvents: VALID_EVENTS,
        },
        { status: 400 }
      );
    }

    const sub = await registerWebhook(
      body.url,
      body.events,
      body.label
    );

    if (!sub) {
      return NextResponse.json(
        { error: "Webhook registration failed. Redis may not be configured." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { webhook: sub, message: "Webhook registered successfully" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { error: "Authentication required. Provide Authorization: Bearer <STATS_API_TOKEN>" },
      { status: 401 }
    );
  }

  const webhooks = await listWebhooks();
  return NextResponse.json({ webhooks, total: webhooks.length });
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Missing 'id' query parameter" },
      { status: 400 }
    );
  }

  const deleted = await unregisterWebhook(id);
  if (deleted) {
    return NextResponse.json({ message: `Webhook ${id} deleted` });
  }
  return NextResponse.json(
    { error: `Webhook ${id} not found` },
    { status: 404 }
  );
}
