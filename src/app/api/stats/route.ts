import { NextResponse } from "next/server";
import { getCallCount } from "@/lib/counter";

export async function GET() {
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

    return NextResponse.json({
      total: grandTotal,
      byTool: totals,
      raw: allCounts,
      counterVersion: "dashboard-creation-v2",
    });
  } catch {
    return NextResponse.json(
      { total: 0, byTool: {}, error: "KV not configured" },
      { status: 200 }
    );
  }
}
