import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const snapshots = await prisma.competitorSnapshot.findMany({
    where: { competitorId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(snapshots);
}
