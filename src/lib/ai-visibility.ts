import type { Location, Competitor } from "@/types";

export interface PromptTemplate {
  slug: string;
  template: string;
  serviceFilter?: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  { slug: "best-boarding", template: "What are the best dog boarding facilities in {city}, {state}?", serviceFilter: "serviceBoarding" },
  { slug: "best-daycare", template: "Can you recommend dog daycare centers in {city}, {state}?", serviceFilter: "serviceDaycare" },
  { slug: "best-grooming", template: "What are the top-rated dog grooming salons near {city}, {state}?", serviceFilter: "serviceGrooming" },
  { slug: "best-pet-care", template: "What are the best pet care facilities in the {city}, {state} area?" },
  { slug: "best-training", template: "Where can I get my dog trained in {city}, {state}?", serviceFilter: "serviceTraining" },
];

export function buildPrompts(location: Location): { slug: string; prompt: string }[] {
  return PROMPT_TEMPLATES
    .filter((t) => {
      if (!t.serviceFilter) return true;
      return (location as Record<string, unknown>)[t.serviceFilter] === true;
    })
    .map((t) => ({
      slug: `${t.slug}-${location.city.toLowerCase().replace(/\s+/g, "-")}`,
      prompt: t.template.replace("{city}", location.city).replace("{state}", location.state),
    }));
}

export interface AIResponse {
  model: string;
  response: string;
}

export async function queryOpenAI(prompt: string): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) { console.log("[AI Visibility] No OPENAI_API_KEY, skipping GPT-4o"); return null; }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[AI Visibility] OpenAI error (${res.status}):`, errText);
      return null;
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.error("[AI Visibility] OpenAI exception:", err);
    return null;
  }
}

export async function queryClaude(prompt: string): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { console.log("[AI Visibility] No ANTHROPIC_API_KEY, skipping Claude"); return null; }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[AI Visibility] Claude error (${res.status}):`, errText);
      return null;
    }
    const data = await res.json();
    return data.content?.[0]?.text ?? null;
  } catch (err) {
    console.error("[AI Visibility] Claude exception:", err);
    return null;
  }
}

export async function queryGemini(prompt: string): Promise<string | null> {
  const key = process.env.GOOGLE_API_KEY ?? process.env.PAGESPEED_API_KEY;
  if (!key) { console.log("[AI Visibility] No GOOGLE_API_KEY or PAGESPEED_API_KEY, skipping Gemini"); return null; }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal: AbortSignal.timeout(30000),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[AI Visibility] Gemini error (${res.status}):`, errText);
      return null;
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (err) {
    console.error("[AI Visibility] Gemini exception:", err);
    return null;
  }
}

export interface ParsedVisibility {
  mentionsEmbark: boolean;
  embarkPosition: number | null;
  mentionedNames: string[];
  competitorsMentioned: { name: string; position: number | null }[];
}

export function parseResponse(
  response: string,
  locationName: string,
  competitors: Competitor[]
): ParsedVisibility {
  const lower = response.toLowerCase();

  // Check for Embark mention (fuzzy: check location name parts)
  const nameParts = locationName.toLowerCase().split(/\s+/);
  const mentionsEmbark = nameParts.length >= 2
    ? nameParts.slice(0, 2).every((part) => lower.includes(part))
    : lower.includes(locationName.toLowerCase());

  // Extract numbered list positions
  const listPattern = /^\s*(\d+)[\.\)]\s+\*{0,2}(.+?)(?:\*{0,2}[\s\-–—:]|$)/gm;
  const listedItems: { position: number; text: string }[] = [];
  let match;
  while ((match = listPattern.exec(response)) !== null) {
    listedItems.push({ position: parseInt(match[1]), text: match[2].trim() });
  }

  // Find Embark's position
  let embarkPosition: number | null = null;
  for (const item of listedItems) {
    const itemLower = item.text.toLowerCase();
    if (nameParts.length >= 2 && nameParts.slice(0, 2).every((p) => itemLower.includes(p))) {
      embarkPosition = item.position;
      break;
    }
  }

  // Scan for competitor mentions
  const competitorsMentioned: { name: string; position: number | null }[] = [];
  const mentionedNames: string[] = [];

  for (const comp of competitors) {
    const compParts = comp.name.toLowerCase().split(/\s+/);
    const compMentioned = compParts.length >= 2
      ? compParts.slice(0, 2).every((part) => lower.includes(part))
      : lower.includes(comp.name.toLowerCase());

    if (compMentioned) {
      mentionedNames.push(comp.name);
      let compPosition: number | null = null;
      for (const item of listedItems) {
        const itemLower = item.text.toLowerCase();
        if (compParts.length >= 2 && compParts.slice(0, 2).every((p) => itemLower.includes(p))) {
          compPosition = item.position;
          break;
        }
      }
      competitorsMentioned.push({ name: comp.name, position: compPosition });
    }
  }

  // Also capture any business names from the list that we didn't match
  for (const item of listedItems) {
    const name = item.text.replace(/\*+/g, "").trim();
    if (name && !mentionedNames.includes(name) && name.length > 3) {
      mentionedNames.push(name);
    }
  }

  return { mentionsEmbark, embarkPosition, mentionedNames, competitorsMentioned };
}
