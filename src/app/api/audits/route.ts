import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { runPageSpeedAudit } from "@/lib/pagespeed";
import { computeOverallScore, getLetterGrade } from "@/lib/grading";

export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("locationId");
  const strategy = searchParams.get("strategy");
  const latest = searchParams.get("latest") === "true";

  const where: Record<string, unknown> = {};
  if (locationId) where.locationId = locationId;
  if (strategy) where.strategy = strategy;

  if (latest) {
    const snapshots = await prisma.auditSnapshot.findMany({
      where,
      orderBy: { createdAt: "desc" },
      distinct: ["locationId", "strategy"],
    });
    return NextResponse.json(snapshots);
  }

  const snapshots = await prisma.auditSnapshot.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(snapshots);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { locationId, strategy: strategyInput } = body as {
    locationId: string;
    strategy: "both" | "desktop" | "mobile";
  };

  const location = await prisma.location.findUnique({
    where: { id: locationId },
  });

  if (!location) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  const url = location.currentUrl;
  if (!url) {
    return NextResponse.json(
      { error: "Location has no URL to audit" },
      { status: 400 }
    );
  }

  const strategies: ("desktop" | "mobile")[] =
    strategyInput === "both"
      ? ["desktop", "mobile"]
      : [strategyInput];

  const snapshots = [];

  try {
    for (const strat of strategies) {
      const result = await runPageSpeedAudit(url, strat);
      const overallScore = computeOverallScore(
        result.scorePerf,
        result.scoreA11y,
        result.scoreSEO,
        result.scoreBP
      );
      const letterGrade = getLetterGrade(overallScore);

      const snapshot = await prisma.auditSnapshot.create({
        data: {
          locationId,
          strategy: strat,
          url,
          scorePerf: result.scorePerf,
          scoreA11y: result.scoreA11y,
          scoreSEO: result.scoreSEO,
          scoreBP: result.scoreBP,
          overallScore,
          letterGrade,
          auditDetails: JSON.stringify({
            opportunities: result.opportunities,
            diagnostics: result.diagnostics,
            allAudits: result.allAudits,
            fetchTime: result.fetchTime,
          }),
        },
      });

      snapshots.push(snapshot);

      // Update location lighthouse scores
      const updateData: Record<string, unknown> = {
        lighthouseAudited: new Date(),
      };
      if (strat === "desktop") {
        updateData.lighthousePerf = result.scorePerf;
        updateData.lighthouseA11y = result.scoreA11y;
        updateData.lighthouseSEO = result.scoreSEO;
        updateData.lighthouseBP = result.scoreBP;
      } else {
        updateData.lighthouseMobilePerf = result.scorePerf;
        updateData.lighthouseMobileA11y = result.scoreA11y;
        updateData.lighthouseMobileSEO = result.scoreSEO;
        updateData.lighthouseMobileBP = result.scoreBP;
      }

      await prisma.location.update({
        where: { id: locationId },
        data: updateData,
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown audit error";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json(snapshots);
}
