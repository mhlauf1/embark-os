import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fetchPlaceDetails } from "@/lib/google-places";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const snapshots = await prisma.competitorRatingSnapshot.findMany({
    where: { competitorId: id },
    orderBy: { recordedAt: "desc" },
  });

  return NextResponse.json(snapshots);
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const competitor = await prisma.competitor.findUnique({ where: { id } });
  if (!competitor) {
    return NextResponse.json({ error: "Competitor not found" }, { status: 404 });
  }
  if (!competitor.placeId) {
    return NextResponse.json({ error: "No placeId configured" }, { status: 400 });
  }

  try {
    const place = await fetchPlaceDetails(competitor.placeId);

    if (place.rating == null || place.userRatingCount == null) {
      return NextResponse.json({ error: "No rating data available" }, { status: 404 });
    }

    const snapshot = await prisma.competitorRatingSnapshot.create({
      data: {
        competitorId: id,
        googleRating: place.rating,
        googleReviewCount: place.userRatingCount,
      },
    });

    // Update denormalized fields
    await prisma.competitor.update({
      where: { id },
      data: {
        googleRating: place.rating,
        googleReviewCount: place.userRatingCount,
      },
    });

    return NextResponse.json(snapshot);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
