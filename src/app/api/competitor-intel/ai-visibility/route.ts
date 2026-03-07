import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  buildPrompts,
  queryOpenAI,
  queryClaude,
  queryGemini,
  parseResponse,
} from "@/lib/ai-visibility";

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("locationId");

  const where: Record<string, unknown> = {};
  if (locationId) where.locationId = locationId;

  const checks = await prisma.aIVisibilityCheck.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(checks);
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
    include: { competitors: true },
  });

  if (!location) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  // Check 24-hour cooldown
  const lastCheck = await prisma.aIVisibilityCheck.findFirst({
    where: { locationId },
    orderBy: { createdAt: "desc" },
  });

  if (lastCheck) {
    const hoursSince = (Date.now() - new Date(lastCheck.createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursSince < 24) {
      return NextResponse.json(
        { error: `Cooldown: last scan was ${Math.round(hoursSince)}h ago. Wait 24h between scans.` },
        { status: 429 }
      );
    }
  }

  const prompts = buildPrompts(location);

  const models: { name: string; fn: (p: string) => Promise<string | null> }[] = [
    { name: "gpt-4o", fn: queryOpenAI },
    { name: "claude-sonnet", fn: queryClaude },
    { name: "gemini-pro", fn: queryGemini },
  ];

  const results = [];

  for (const { slug, prompt } of prompts) {
    for (const model of models) {
      try {
        const response = await model.fn(prompt);
        if (!response) continue;

        const parsed = parseResponse(response, location.name, location.competitors);

        const check = await prisma.aIVisibilityCheck.create({
          data: {
            locationId,
            prompt,
            promptSlug: slug,
            model: model.name,
            response,
            mentionsEmbark: parsed.mentionsEmbark,
            embarkPosition: parsed.embarkPosition,
            mentionedNames: JSON.stringify(parsed.mentionedNames),
            competitorsMentioned: JSON.stringify(parsed.competitorsMentioned),
          },
        });

        results.push(check);
      } catch {
        // Skip failed model calls
      }
    }
  }

  return NextResponse.json({ scanned: results.length, results });
}
