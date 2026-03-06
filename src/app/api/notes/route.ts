import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { locationId, body: noteBody, isBlocker } = body;

  const note = await prisma.note.create({
    data: {
      locationId,
      body: noteBody,
      isBlocker: isBlocker ?? false,
      author: "Mike",
    },
  });

  return NextResponse.json(note, { status: 201 });
}
