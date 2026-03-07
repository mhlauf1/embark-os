import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fetchPlaceDetails } from "@/lib/google-places";

export const maxDuration = 120;

export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const competitors = await prisma.competitor.findMany({
    where: { placeId: { not: null } },
    select: { id: true, name: true, placeId: true },
  });

  const results: { id: string; name: string; status: string }[] = [];

  for (const comp of competitors) {
    try {
      const place = await fetchPlaceDetails(comp.placeId!);

      if (place.rating != null && place.userRatingCount != null) {
        await prisma.competitorRatingSnapshot.create({
          data: {
            competitorId: comp.id,
            googleRating: place.rating,
            googleReviewCount: place.userRatingCount,
          },
        });

        await prisma.competitor.update({
          where: { id: comp.id },
          data: {
            googleRating: place.rating,
            googleReviewCount: place.userRatingCount,
          },
        });

        results.push({ id: comp.id, name: comp.name, status: "ok" });
      } else {
        results.push({ id: comp.id, name: comp.name, status: "no-data" });
      }
    } catch (err) {
      results.push({
        id: comp.id,
        name: comp.name,
        status: err instanceof Error ? err.message : "error",
      });
    }
  }

  return NextResponse.json({ scanned: results.length, results });
}
