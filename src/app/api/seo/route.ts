import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { runSeoCrawl } from "@/lib/seo-crawl";

export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("locationId");
  const latest = searchParams.get("latest") === "true";

  const where: Record<string, unknown> = {};
  if (locationId) where.locationId = locationId;

  if (latest) {
    const snapshots = await prisma.seoSnapshot.findMany({
      where,
      orderBy: { createdAt: "desc" },
      distinct: ["locationId"],
    });
    return NextResponse.json(snapshots);
  }

  const snapshots = await prisma.seoSnapshot.findMany({
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
  const { locationId } = body as { locationId: string };

  const location = await prisma.location.findUnique({
    where: { id: locationId },
  });

  if (!location) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  const url = location.currentUrl;
  if (!url) {
    return NextResponse.json(
      { error: "Location has no URL to crawl" },
      { status: 400 }
    );
  }

  try {
    const result = await runSeoCrawl(url);

    const snapshot = await prisma.seoSnapshot.create({
      data: {
        locationId,
        url: result.url,
        overallScore: result.overallScore,
        letterGrade: result.letterGrade,
        responseTimeMs: result.responseTimeMs,
        checkResults: JSON.stringify(result.checks),
      },
    });

    return NextResponse.json(snapshot);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown crawl error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
