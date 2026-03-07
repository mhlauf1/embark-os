"use client";

import { useState } from "react";
import type { AuditSnapshot, Location } from "@/types";
import { getLetterGrade, getGradeColor } from "@/lib/grading";

interface AuditComparisonChartProps {
  locations: Location[];
  snapshots: AuditSnapshot[];
}

const categories = [
  { key: "scorePerf", label: "Performance", short: "PERF" },
  { key: "scoreA11y", label: "Accessibility", short: "A11Y" },
  { key: "scoreSEO", label: "SEO", short: "SEO" },
  { key: "scoreBP", label: "Best Practices", short: "BP" },
] as const;

type CategoryKey = (typeof categories)[number]["key"];

function scoreColor(score: number): string {
  if (score >= 90) return "#4A9A6E";
  if (score >= 50) return "#CB8A40";
  return "#C45C4A";
}

export function AuditComparisonChart({
  locations,
  snapshots,
}: AuditComparisonChartProps) {
  const [strategy, setStrategy] = useState<"desktop" | "mobile">("desktop");

  const audited = locations
    .map((loc) => {
      const snap = snapshots.find(
        (s) => s.locationId === loc.id && s.strategy === strategy
      );
      if (!snap) return null;
      return { location: loc, snapshot: snap };
    })
    .filter(
      (d): d is { location: Location; snapshot: AuditSnapshot } => d !== null
    );

  if (audited.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No audit data available. Run audits to see comparisons.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <div className="flex gap-1 rounded-md border border-border bg-muted p-0.5">
          {(["desktop", "mobile"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStrategy(s)}
              className={`rounded px-2.5 py-1 font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-wider transition-colors ${
                strategy === s
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {categories.map((cat) => {
          const sorted = [...audited].sort(
            (a, b) =>
              (b.snapshot[cat.key] as number) - (a.snapshot[cat.key] as number)
          );

          const avg = Math.round(
            sorted.reduce((s, d) => s + (d.snapshot[cat.key] as number), 0) /
              sorted.length
          );

          return (
            <div
              key={cat.key}
              className="rounded-lg border border-border bg-card"
            >
              <div className="flex items-baseline justify-between border-b border-border px-4 py-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-widest text-muted-foreground">
                    {cat.short}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {cat.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-muted-foreground">
                    AVG
                  </span>
                  <span
                    className="font-[family-name:var(--font-geist-mono)] text-sm font-semibold"
                    style={{ color: scoreColor(avg) }}
                  >
                    {avg}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-border/50">
                {sorted.map(({ location, snapshot }, i) => {
                  const score = snapshot[cat.key] as number;
                  return (
                    <div
                      key={location.id}
                      className="flex items-center gap-3 px-4 py-2"
                    >
                      <span className="w-4 shrink-0 font-[family-name:var(--font-geist-mono)] text-[10px] text-muted-foreground/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                        {location.name}
                      </span>
                      <div className="flex w-24 items-center gap-2">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${score}%`,
                              backgroundColor: scoreColor(score),
                            }}
                          />
                        </div>
                      </div>
                      <span
                        className="w-7 shrink-0 text-right font-[family-name:var(--font-geist-mono)] text-xs font-semibold"
                        style={{ color: scoreColor(score) }}
                      >
                        {score}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
