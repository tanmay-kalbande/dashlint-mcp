import { NextResponse } from "next/server";
import { SERVER_VERSION, DASHBOARD_KIT_VERSION } from "@/lib/versions";
import { getCounterHealth } from "@/lib/counter";

/**
 * Health check endpoint for uptime monitoring.
 *
 * Returns server status, version info, counter health, and uptime metadata.
 * No authentication required — this is a standard health probe.
 */
export async function GET() {
  const counter = getCounterHealth();

  return NextResponse.json(
    {
      status:
        counter.status === "healthy" || counter.status === "unavailable"
          ? "healthy"
          : "degraded",
      serverVersion: SERVER_VERSION,
      dashboardKitVersion: DASHBOARD_KIT_VERSION,
      protocolVersion: "2024-11-05",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      counter,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    }
  );
}
