import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const snapshots = await prisma.ratingSnapshot.findMany({
    where: { locationId: id },
    orderBy: { recordedAt: "asc" },
  });

  return NextResponse.json(snapshots);
}
