import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { locationId, name, ...rest } = body;

  if (!locationId || !name) {
    return NextResponse.json({ error: "locationId and name are required" }, { status: 400 });
  }

  const competitor = await prisma.competitor.create({
    data: { locationId, name, ...rest },
  });

  return NextResponse.json(competitor, { status: 201 });
}
