import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { locationId, googleRating, googleReviewCount } = body;

  if (!locationId || googleRating == null || googleReviewCount == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const snapshot = await prisma.ratingSnapshot.create({
    data: { locationId, googleRating, googleReviewCount },
  });

  return NextResponse.json(snapshot, { status: 201 });
}
