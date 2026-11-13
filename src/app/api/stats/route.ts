import { NextRequest, NextResponse } from "next/server";
import { getCallCount } from "@/lib/counter";

/**
 * Stats API — protected by a bearer token.
 *
 * Public requests (no token) receive only the grand total count.
 * Authenticated requests (valid STATS_API_TOKEN) receive the full breakdown.
 *
 * Set STATS_API_TOKEN in your environment variables to enable full access.
 */
export async function GET(request: NextRequest) {
  try {
    const allCounts = await getCallCount();

    const totals: Record<string, number> = {};
    let grandTotal = 0;

    for (const [key, count] of Object.entries(allCounts)) {
      const parts = key.split(":");
      const toolName = parts[3] || "unknown";
      totals[toolName] = (totals[toolName] || 0) + count;
      grandTotal += count;
    }

    // Check for bearer token authentication
    const authHeader = request.headers.get("authorization");
    const configuredToken = process.env.STATS_API_TOKEN;
    const isAuthenticated =
      configuredToken &&
      authHeader?.startsWith("Bearer ") &&
      authHeader.slice(7) === configuredToken;

    if (isAuthenticated) {
      // Full response for authenticated requests
      return NextResponse.json({
        total: grandTotal,
        byTool: totals,
        raw: allCounts,
        counterVersion: "dashboard-creation-v2",
      });
    }

    // Public response: only the total count (no raw Redis keys)
    return NextResponse.json({
      total: grandTotal,
      counterVersion: "dashboard-creation-v2",
    });
  } catch {
    return NextResponse.json(
      { total: 0, error: "Stats temporarily unavailable" },
      { status: 200 }
    );
  }
}
