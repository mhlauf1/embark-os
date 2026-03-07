import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeMarketPosition } from "@/lib/market-position";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const locations = await prisma.location.findMany({
    include: { competitors: true },
    orderBy: { name: "asc" },
  });

  const positions = locations
    .filter((loc) => loc.competitors.length > 0)
    .map((loc) => computeMarketPosition(loc, loc.competitors));

  return NextResponse.json(positions);
}
