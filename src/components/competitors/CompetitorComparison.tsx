"use client";

import { Star } from "lucide-react";
import type { Location, Competitor } from "@/types";
import { LighthouseScore } from "@/components/metrics/LighthouseScore";

interface CompetitorComparisonProps {
  location: Location;
  competitors: Competitor[];
}

interface CompareRow {
  label: string;
  ours: string | number | null;
  competitors: (string | number | null)[];
  type?: "score" | "rating" | "text";
}

export function CompetitorComparison({ location, competitors }: CompetitorComparisonProps) {
  if (competitors.length === 0) return null;

  const rows: CompareRow[] = [
    {
      label: "Google Rating",
      ours: location.googleRating,
      competitors: competitors.map((c) => c.googleRating),
      type: "rating",
    },
    {
      label: "Reviews",
      ours: location.googleReviewCount,
      competitors: competitors.map((c) => c.googleReviewCount),
      type: "text",
    },
    {
      label: "Desktop Perf",
      ours: location.lighthousePerf,
      competitors: competitors.map((c) => c.lighthousePerf),
      type: "score",
    },
    {
      label: "Desktop A11y",
      ours: location.lighthouseA11y,
      competitors: competitors.map((c) => c.lighthouseA11y),
      type: "score",
    },
    {
      label: "Desktop SEO",
      ours: location.lighthouseSEO,
      competitors: competitors.map((c) => c.lighthouseSEO),
      type: "score",
    },
    {
      label: "Desktop BP",
      ours: location.lighthouseBP,
      competitors: competitors.map((c) => c.lighthouseBP),
      type: "score",
    },
    {
      label: "Mobile Perf",
      ours: location.lighthouseMobilePerf,
      competitors: competitors.map((c) => c.lighthouseMobilePerf),
      type: "score",
    },
    {
      label: "Mobile A11y",
      ours: location.lighthouseMobileA11y,
      competitors: competitors.map((c) => c.lighthouseMobileA11y),
      type: "score",
    },
    {
      label: "Mobile SEO",
      ours: location.lighthouseMobileSEO,
      competitors: competitors.map((c) => c.lighthouseMobileSEO),
      type: "score",
    },
    {
      label: "Mobile BP",
      ours: location.lighthouseMobileBP,
      competitors: competitors.map((c) => c.lighthouseMobileBP),
      type: "score",
    },
  ];

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="text-sm font-medium text-foreground">Comparison</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Side-by-side: {location.name} vs local competitors
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Metric</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-primary">
                {location.name}
              </th>
              {competitors.map((c) => (
                <th key={c.id} className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border">
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.label}</td>
                <td className="px-4 py-2.5 text-center">
                  <CompareCell value={row.ours} type={row.type} />
                </td>
                {row.competitors.map((val, i) => (
                  <td key={i} className="px-4 py-2.5 text-center">
                    <CompareCell value={val} type={row.type} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompareCell({ value, type }: { value: string | number | null; type?: string }) {
  if (value === null || value === undefined) {
    return <span className="text-xs text-muted-foreground/30">—</span>;
  }

  if (type === "rating") {
    return (
      <div className="inline-flex items-center gap-1">
        <Star className="h-3 w-3 fill-warning text-warning" />
        <span className="font-[family-name:var(--font-geist-mono)] text-sm text-foreground">
          {Number(value).toFixed(1)}
        </span>
      </div>
    );
  }

  if (type === "score" && typeof value === "number") {
    return (
      <div className="flex justify-center">
        <LighthouseScore score={value} size="sm" />
      </div>
    );
  }

  return (
    <span className="font-[family-name:var(--font-geist-mono)] text-sm text-foreground">
      {typeof value === "number" ? value.toLocaleString() : value}
    </span>
  );
}
