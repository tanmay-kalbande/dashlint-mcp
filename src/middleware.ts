import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";
import { logger } from "@/lib/logger";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}

/**
 * Edge middleware that applies:
 * 1. Comprehensive security headers (CSP, HSTS, X-Frame-Options, etc.)
 * 2. Cross-Origin Resource Sharing (CORS) with preflight handling for MCP
 * 3. Token-bucket rate limiting against DDoS and runaway assistant loops
 * 4. Cache-Control headers for static and dynamic API routes
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;
  const clientIp = getClientIp(request);

  // ── Security Headers (all routes) ─────────────────────────────────────
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.sheetjs.com https://cdn.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://*.vercel-insights.com https://fonts.googleapis.com https://fonts.gstatic.com; frame-ancestors 'none'"
  );

  // ── CORS for /mcp and /api/mcp (MCP clients connect cross-origin) ────
  const isMcpRoute = pathname === "/mcp" || pathname.startsWith("/api/mcp");

  if (isMcpRoute) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Mcp-Session-Id"
    );
    response.headers.set(
      "Access-Control-Expose-Headers",
      "Mcp-Session-Id, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset"
    );

    // Handle preflight
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers,
      });
    }
  }

  // ── Rate Limiting ─────────────────────────────────────────────────────
  if (isMcpRoute || pathname.startsWith("/api/webhooks")) {
    const isWebhook = pathname.startsWith("/api/webhooks");
    const limit = isWebhook ? 20 : 120; // 120 reqs/min for MCP, 20/min for webhooks
    const windowSec = 60;

    const rateResult = await checkRateLimit(`${clientIp}:${isWebhook ? "wh" : "mcp"}`, limit, windowSec);

    response.headers.set("X-RateLimit-Limit", String(rateResult.limit));
    response.headers.set("X-RateLimit-Remaining", String(rateResult.remaining));
    response.headers.set("X-RateLimit-Reset", String(rateResult.resetSeconds));

    if (!rateResult.allowed) {
      logger.warn("Rate limit exceeded", {
        clientIp,
        pathname,
        limit,
        resetSeconds: rateResult.resetSeconds,
      });

      return new NextResponse(
        JSON.stringify({
          error: "RATE_LIMIT_EXCEEDED",
          message: `Too many requests. Limit is ${limit} requests per minute. Please retry in ${rateResult.resetSeconds} seconds.`,
          retryAfter: rateResult.resetSeconds,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(rateResult.resetSeconds),
            "X-RateLimit-Limit": String(rateResult.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateResult.resetSeconds),
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  }

  // ── Cache-Control headers for MCP responses ──────────────────────────
  if (isMcpRoute) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, s-maxage=300, stale-while-revalidate=60"
    );
  }

  // ── Cache-Control headers for health endpoint ─────────────────────────
  if (pathname === "/api/health") {
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images:
     * _next/static, _next/image, favicon.ico, etc.
     */
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.(?:png|svg)|apple-touch-icon\\.png).*)",
  ],
};
