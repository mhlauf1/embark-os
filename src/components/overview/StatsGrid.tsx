"use client";

import { Star } from "lucide-react";
import { getGradeColor } from "@/lib/grading";

interface StatsGridProps {
  // Hero
  total: number;
  uniqueStates: number;
  liveCount: number;
  inProgressCount: number;
  notStartedCount: number;
  // Web Performance
  avgLighthouse: number | null;
  lighthouseGrade: string | null;
  auditedCount: number;
  // Reputation
  avgRating: number | null;
  totalReviews: number;
  ratedCount: number;
  // SEO Health
  avgSeoScore: number | null;
  seoGrade: string | null;
  totalSeoIssues: number;
  seoCrawledCount: number;
  // Market Edge
  avgMarketScore: number | null;
  marketGrade: string | null;
  avgRatingDelta: number | null;
  totalCompetitors: number;
}

function SegmentBar({
  segments,
}: {
  segments: { count: number; color: string; label: string }[];
}) {
  const total = segments.reduce((s, seg) => s + seg.count, 0);
  if (total === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex h-2 overflow-hidden rounded-full bg-border">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className="h-full transition-all duration-500"
            style={{
              width: `${(seg.count / total) * 100}%`,
              backgroundColor: seg.color,
            }}
          />
        ))}
      </div>
      <div className="flex gap-4">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              {seg.label} ({seg.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsGrid({
  total,
  uniqueStates,
  liveCount,
  inProgressCount,
  notStartedCount,
  avgLighthouse,
  lighthouseGrade,
  auditedCount,
  avgRating,
  totalReviews,
  ratedCount,
  avgSeoScore,
  seoGrade,
  totalSeoIssues,
  seoCrawledCount,
  avgMarketScore,
  marketGrade,
  avgRatingDelta,
  totalCompetitors,
}: StatsGridProps) {
  return (
    <div className="space-y-3">
      {/* Primary Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Cell 01 — Portfolio (hero, span-2) */}
        <div className="rounded-lg border border-border bg-card p-5 sm:col-span-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            01 // Portfolio
          </p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-6xl text-foreground sm:text-7xl">
              {total}
            </span>
            <span className="text-sm text-muted-foreground">
              Across {uniqueStates} states
            </span>
          </div>
          <div className="mt-1">
            <p className="text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#4A9A6E" }} />
                {liveCount} live
              </span>
              <span className="mx-1.5">·</span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#CB8A40" }} />
                {inProgressCount} in progress
              </span>
              <span className="mx-1.5">·</span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#E5DFD7" }} />
                {notStartedCount} not started
              </span>
            </p>
          </div>
          <div className="mt-4">
            <SegmentBar
              segments={[
                { count: liveCount, color: "#4A9A6E", label: "Live" },
                { count: inProgressCount, color: "#CB8A40", label: "In Progress" },
                { count: notStartedCount, color: "#E5DFD7", label: "Not Started" },
              ]}
            />
          </div>
        </div>

        {/* Cell 02 — Web Performance */}
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            02 // Web Performance
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            {lighthouseGrade !== null ? (
              <span
                className="font-display text-3xl"
                style={{ color: getGradeColor(lighthouseGrade) }}
              >
                {lighthouseGrade}
              </span>
            ) : (
              <span className="font-display text-3xl text-muted-foreground">—</span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {avgLighthouse !== null
              ? `Avg ${avgLighthouse} / 100 across ${auditedCount} audited`
              : "No locations audited"}
          </p>
        </div>

        {/* Cell 03 — Reputation */}
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            03 // Reputation
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            {avgRating !== null ? (
              <>
                <span className="font-display text-3xl text-foreground">
                  {avgRating.toFixed(1)}
                </span>
                <Star className="h-4 w-4 fill-warning text-warning" />
              </>
            ) : (
              <span className="font-display text-3xl text-muted-foreground">—</span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {totalReviews.toLocaleString()} reviews across {ratedCount} locations
          </p>
        </div>
      </div>

      {/* Secondary Row — Compact Metric Pills */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Cell 04 — SEO Health */}
        <div className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
              04 // SEO Health
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              {seoGrade !== null ? (
                <span
                  className="font-display text-xl"
                  style={{ color: getGradeColor(seoGrade) }}
                >
                  {seoGrade}
                </span>
              ) : (
                <span className="font-display text-xl text-muted-foreground">—</span>
              )}
              <span className="text-[10px] text-muted-foreground">
                {seoCrawledCount > 0
                  ? `${totalSeoIssues} issue${totalSeoIssues !== 1 ? "s" : ""} across ${seoCrawledCount} location${seoCrawledCount !== 1 ? "s" : ""}`
                  : "No SEO snapshots"}
              </span>
            </div>
          </div>
        </div>

        {/* Cell 05 — Market Edge */}
        <div className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
              05 // Market Edge
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              {avgMarketScore !== null && marketGrade !== null ? (
                <>
                  <span
                    className="font-display text-xl"
                    style={{ color: getGradeColor(marketGrade) }}
                  >
                    {avgMarketScore}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: getGradeColor(marketGrade) }}
                  >
                    {marketGrade}
                  </span>
                </>
              ) : (
                <span className="font-display text-xl text-muted-foreground">—</span>
              )}
              <span className="text-[10px] text-muted-foreground">
                {avgRatingDelta !== null
                  ? `${avgRatingDelta > 0 ? "+" : ""}${avgRatingDelta} avg rating edge · ${totalCompetitors} competitor${totalCompetitors !== 1 ? "s" : ""}`
                  : totalCompetitors > 0
                    ? `${totalCompetitors} competitor${totalCompetitors !== 1 ? "s" : ""} tracked`
                    : "No competitors tracked"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
