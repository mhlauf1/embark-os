import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { locationId, name, email, phone, role, company, notes, isPrimary } = body;

  if (!locationId || !name || !role) {
    return NextResponse.json(
      { error: "locationId, name, and role are required" },
      { status: 400 }
    );
  }

  const contact = await prisma.contact.create({
    data: {
      locationId,
      name,
      email: email || null,
      phone: phone || null,
      role,
      company: company || null,
      notes: notes || null,
      isPrimary: isPrimary ?? false,
    },
  });

  return NextResponse.json(contact, { status: 201 });
}
