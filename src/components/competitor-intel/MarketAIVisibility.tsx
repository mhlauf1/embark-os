"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Loader2, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import type { AIVisibilityCheck } from "@/types";

interface Props {
  locationId: string;
  locationName: string;
  checks: AIVisibilityCheck[];
}

export function MarketAIVisibility({ locationId, locationName, checks }: Props) {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);

  async function handleScan() {
    setScanning(true);
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
      setScanning(false);
    }
  }

  const totalChecks = checks.length;
  const mentions = checks.filter((c) => c.mentionsEmbark).length;
  const mentionRate = totalChecks > 0 ? Math.round((mentions / totalChecks) * 100) : 0;

  // Group by model
  const byModel = new Map<string, AIVisibilityCheck[]>();
  for (const check of checks) {
    const existing = byModel.get(check.model) ?? [];
    existing.push(check);
    byModel.set(check.model, existing);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {totalChecks > 0 && (
            <span
              className="rounded px-2 py-1 font-[family-name:var(--font-geist-mono)] text-sm font-medium"
              style={{
                color: mentionRate >= 50 ? "#22c55e" : "#ef4444",
                backgroundColor: mentionRate >= 50 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              }}
            >
              {mentionRate}% mention rate
            </span>
          )}
          {totalChecks > 0 && (
            <span className="text-xs text-muted-foreground">
              {mentions}/{totalChecks} checks mention {locationName}
            </span>
          )}
        </div>
        <button
          onClick={handleScan}
          disabled={scanning}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
        >
          {scanning ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Scanning all models...
            </>
          ) : (
            <>
              <Bot className="h-3.5 w-3.5" />
              Run AI Scan
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {totalChecks === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <Bot className="mx-auto h-8 w-8 text-muted-foreground/30" />
          <p className="mt-2 text-sm text-muted-foreground">
            No AI visibility scans yet. Click "Run AI Scan" to query GPT-4o, Claude, and Gemini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Model summary cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            {(["gpt-4o", "claude-sonnet", "gemini-pro"] as const).map((model) => {
              const modelChecks = byModel.get(model) ?? [];
              const modelMentions = modelChecks.filter((c) => c.mentionsEmbark).length;
              const label = model === "gpt-4o" ? "GPT-4o" : model === "claude-sonnet" ? "Claude" : "Gemini";

              return (
                <div key={model} className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{label}</span>
                    {modelChecks.length > 0 ? (
                      <span
                        className="rounded px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-[10px] font-medium"
                        style={{
                          color: modelMentions > 0 ? "#22c55e" : "#ef4444",
                          backgroundColor: modelMentions > 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        }}
                      >
                        {modelMentions}/{modelChecks.length}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/30">no data</span>
                    )}
                  </div>
                  {modelChecks.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {modelChecks.slice(0, 5).map((check) => (
                        <div key={check.id} className="flex items-center gap-1.5 text-[10px]">
                          {check.mentionsEmbark ? (
                            <Check className="h-3 w-3 shrink-0 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 shrink-0 text-red-400" />
                          )}
                          <span className="truncate text-muted-foreground">{check.promptSlug}</span>
                          {check.embarkPosition && (
                            <span className="ml-auto shrink-0 font-[family-name:var(--font-geist-mono)] text-muted-foreground">
                              #{check.embarkPosition}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Full check list */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border p-3">
              <h4 className="text-xs font-medium text-foreground">All Checks</h4>
            </div>
            <div className="divide-y divide-border">
              {checks.map((check) => (
                <div key={check.id}>
                  <button
                    onClick={() => setExpandedCheck(expandedCheck === check.id ? null : check.id)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/50 transition-colors"
                  >
                    {check.mentionsEmbark ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
                    ) : (
                      <X className="h-3.5 w-3.5 shrink-0 text-red-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-foreground">{check.promptSlug}</span>
                      <span className="ml-2 font-[family-name:var(--font-geist-mono)] text-[10px] text-muted-foreground">
                        {check.model}
                      </span>
                    </div>
                    {check.embarkPosition && (
                      <span className="font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
                        #{check.embarkPosition}
                      </span>
                    )}
                    {expandedCheck === check.id ? (
                      <ChevronUp className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  {expandedCheck === check.id && (
                    <div className="border-t border-border bg-muted/30 px-4 py-3">
                      <p className="mb-2 text-[10px] font-medium text-muted-foreground">PROMPT</p>
                      <p className="mb-3 text-xs text-foreground">{check.prompt}</p>
                      <p className="mb-2 text-[10px] font-medium text-muted-foreground">RESPONSE</p>
                      <p className="whitespace-pre-wrap text-xs text-muted-foreground leading-relaxed">
                        {check.response}
                      </p>
                      {check.competitorsMentioned && (
                        <>
                          <p className="mb-1 mt-3 text-[10px] font-medium text-muted-foreground">COMPETITORS MENTIONED</p>
                          <p className="text-xs text-muted-foreground">{check.competitorsMentioned}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
