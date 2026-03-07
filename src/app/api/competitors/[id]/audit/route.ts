import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { runCompetitorAudit } from "@/lib/competitor-audit";

export const maxDuration = 120;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const strategy = (body.strategy as "desktop" | "mobile" | "both") ?? "desktop";

  const strategies: ("desktop" | "mobile")[] =
    strategy === "both" ? ["desktop", "mobile"] : [strategy];

  const snapshots = [];

  try {
    for (const strat of strategies) {
      const snapshot = await runCompetitorAudit(id, strat);
      snapshots.push(snapshot);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown audit error";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json(snapshots);
}
