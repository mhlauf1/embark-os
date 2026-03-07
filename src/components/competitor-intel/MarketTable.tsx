"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { MarketPosition } from "@/lib/market-position";
import { getGradeColor, getGradeBgColor } from "@/lib/grading";

interface Props {
  positions: MarketPosition[];
}

export function MarketTable({ positions }: Props) {
  if (positions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No markets with competitors yet. Add competitors on individual location pages.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Location</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Our Rating</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Avg Comp</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Delta</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">LH Gap</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Services</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Score</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground" />
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => (
              <tr key={p.locationId} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <span className="font-display text-sm text-foreground">{p.locationName}</span>
                    <span className="ml-2 font-[family-name:var(--font-geist-mono)] text-[10px] text-muted-foreground">
                      {p.city}, {p.state}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {p.competitorCount} competitor{p.competitorCount !== 1 ? "s" : ""}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {p.ourRating !== null ? (
                    <div className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="font-[family-name:var(--font-geist-mono)] text-sm">{p.ourRating.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/30">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {p.avgCompRating !== null ? (
                    <span className="font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
                      {p.avgCompRating.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/30">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <DeltaPill value={p.ratingDelta} />
                </td>
                <td className="px-4 py-3 text-center">
                  <DeltaPill value={p.lighthouseGap} suffix="pts" />
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
                    {p.ourServiceCount} / {p.maxCompServiceCount || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="font-[family-name:var(--font-geist-mono)] text-sm font-medium">{p.compositeScore}</span>
                    <span
                      className="rounded px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-[10px] font-medium"
                      style={{ color: getGradeColor(p.letterGrade), backgroundColor: getGradeBgColor(p.letterGrade) }}
                    >
                      {p.letterGrade}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <Link
                    href={`/competitors/${p.locationId}`}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Detail <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeltaPill({ value, suffix }: { value: number | null; suffix?: string }) {
  if (value === null) {
    return <span className="text-xs text-muted-foreground/30">—</span>;
  }

  const isPositive = value >= 0;
  return (
    <span
      className="inline-block rounded px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-xs font-medium"
      style={{
        color: isPositive ? "#4A9A6E" : "#C45C4A",
        backgroundColor: isPositive ? "rgba(74,154,110,0.1)" : "rgba(196,92,74,0.1)",
      }}
    >
      {isPositive ? "+" : ""}{value}{suffix ? ` ${suffix}` : ""}
    </span>
  );
}
