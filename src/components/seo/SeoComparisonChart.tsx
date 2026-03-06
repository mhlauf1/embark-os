"use client";

import type { Location, SeoSnapshot } from "@/types";
import { getGradeColor } from "@/lib/grading";

interface SeoComparisonChartProps {
  locations: Location[];
  snapshots: SeoSnapshot[];
}

function scoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function SeoComparisonChart({
  locations,
  snapshots,
}: SeoComparisonChartProps) {
  const data = locations
    .map((loc) => {
      const snap = snapshots.find((s) => s.locationId === loc.id);
      if (!snap) return null;
      return { location: loc, snapshot: snap };
    })
    .filter(
      (d): d is { location: Location; snapshot: SeoSnapshot } => d !== null
    )
    .sort((a, b) => b.snapshot.overallScore - a.snapshot.overallScore);

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No SEO data available. Run crawls to see comparisons.
      </div>
    );
  }

  const avg = Math.round(
    data.reduce((s, d) => s + d.snapshot.overallScore, 0) / data.length
  );

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-baseline justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-medium text-foreground">
          SEO Score by Location
        </span>
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
        {data.map(({ location, snapshot }, i) => (
          <div
            key={location.id}
            className="flex items-center gap-3 px-4 py-2.5"
          >
            <span className="w-4 shrink-0 font-[family-name:var(--font-geist-mono)] text-[10px] text-muted-foreground/50">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-foreground">
              {location.name}
            </span>
            <div className="flex w-32 items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${snapshot.overallScore}%`,
                    backgroundColor: scoreColor(snapshot.overallScore),
                  }}
                />
              </div>
            </div>
            <span
              className="inline-flex items-center rounded px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-xs font-semibold"
              style={{
                color: getGradeColor(snapshot.letterGrade),
                backgroundColor: `${getGradeColor(snapshot.letterGrade)}15`,
              }}
            >
              {snapshot.letterGrade}
            </span>
            <span
              className="w-7 shrink-0 text-right font-[family-name:var(--font-geist-mono)] text-xs font-semibold"
              style={{ color: scoreColor(snapshot.overallScore) }}
            >
              {snapshot.overallScore}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
