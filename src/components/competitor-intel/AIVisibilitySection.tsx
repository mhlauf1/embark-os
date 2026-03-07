"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Loader2, Check, X, Minus } from "lucide-react";
import type { Location, AIVisibilityCheck, Competitor } from "@/types";

type LocationWithAI = Location & {
  aiVisibilityChecks: AIVisibilityCheck[];
  competitors: Competitor[];
};

interface Props {
  locations: LocationWithAI[];
}

export function AIVisibilitySection({ locations }: Props) {
  const router = useRouter();
  const [scanning, setScanning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const locationsWithCompetitors = locations.filter(
    (l) => l.competitors.length > 0
  );

  async function handleScan(locationId: string) {
    setScanning(locationId);
    setError(null);

    try {
      const res = await fetch("/api/competitor-intel/ai-visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Scan failed");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setScanning(null);
    }
  }

  // Group checks by location
  const locationGroups = locationsWithCompetitors.map((loc) => {
    const checks = loc.aiVisibilityChecks;
    const totalChecks = checks.length;
    const mentions = checks.filter((c) => c.mentionsEmbark).length;
    const avgPosition = checks
      .filter((c) => c.embarkPosition !== null)
      .reduce((sum, c, _, arr) => sum + (c.embarkPosition! / arr.length), 0);

    // Group by model
    const byModel = new Map<string, { total: number; mentions: number }>();
    for (const check of checks) {
      const existing = byModel.get(check.model) ?? { total: 0, mentions: 0 };
      existing.total++;
      if (check.mentionsEmbark) existing.mentions++;
      byModel.set(check.model, existing);
    }

    return { location: loc, totalChecks, mentions, avgPosition, byModel };
  });

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Location</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">GPT-4o</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Claude</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Gemini</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Mention Rate</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Avg Position</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground" />
              </tr>
            </thead>
            <tbody>
              {locationGroups.map(({ location, totalChecks, mentions, avgPosition, byModel }) => (
                <tr key={location.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <span className="font-display text-sm text-foreground">{location.name}</span>
                    <span className="ml-2 font-[family-name:var(--font-geist-mono)] text-[10px] text-muted-foreground">
                      {location.city}, {location.state}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ModelCell data={byModel.get("gpt-4o")} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ModelCell data={byModel.get("claude-sonnet")} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ModelCell data={byModel.get("gemini-pro")} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {totalChecks > 0 ? (
                      <span
                        className="inline-block rounded px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-xs font-medium"
                        style={{
                          color: mentions / totalChecks >= 0.5 ? "#22c55e" : "#ef4444",
                          backgroundColor: mentions / totalChecks >= 0.5 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        }}
                      >
                        {Math.round((mentions / totalChecks) * 100)}%
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/30">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
                    {avgPosition > 0 ? `#${avgPosition.toFixed(1)}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleScan(location.id)}
                      disabled={scanning !== null}
                      className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
                    >
                      {scanning === location.id ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Bot className="h-3 w-3" />
                          Scan
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground">
        AI visibility scans query GPT-4o, Claude, and Gemini with real pet-owner prompts.
        24-hour cooldown per location. Results may vary between scans.
      </p>
    </div>
  );
}

function ModelCell({ data }: { data?: { total: number; mentions: number } }) {
  if (!data) {
    return <Minus className="mx-auto h-3.5 w-3.5 text-muted-foreground/20" />;
  }

  if (data.mentions > 0) {
    return (
      <div className="inline-flex items-center gap-1">
        <Check className="h-3.5 w-3.5 text-green-500" />
        <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-muted-foreground">
          {data.mentions}/{data.total}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1">
      <X className="h-3.5 w-3.5 text-red-400" />
      <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-muted-foreground">
        0/{data.total}
      </span>
    </div>
  );
}
