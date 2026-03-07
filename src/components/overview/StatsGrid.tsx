"use client";

import { Star } from "lucide-react";
import { getGradeColor } from "@/lib/grading";
import { GROUP_META } from "@/lib/groupLocations";

interface StatsGridProps {
  // Hero
  total: number;
  uniqueStates: number;
  laufBuiltCount: number;
  inDevCount: number;
  onboardingCount: number;
  notEngagedCount: number;
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
  // Layout
  orientation?: "horizontal" | "vertical";
}

function SegmentBar({
  segments,
  compact,
}: {
  segments: { count: number; color: string; label: string }[];
  compact?: boolean;
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
      <div className={compact ? "flex flex-wrap gap-x-3 gap-y-1" : "flex flex-wrap gap-x-4 gap-y-1"}>
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
  laufBuiltCount,
  inDevCount,
  onboardingCount,
  notEngagedCount,
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
  orientation = "horizontal",
}: StatsGridProps) {
  const isVertical = orientation === "vertical";

  const segments = [
    { count: laufBuiltCount, color: GROUP_META["lauf-built"].accent, label: "Lauf Built" },
    { count: inDevCount, color: GROUP_META["in-development"].accent, label: "In Dev" },
    { count: onboardingCount, color: GROUP_META["onboarding"].accent, label: "Onboarding" },
    { count: notEngagedCount, color: GROUP_META["not-engaged"].accent, label: "Not Engaged" },
  ];

  const cell01 = (
    <div className={`rounded-lg border border-border bg-card p-5 ${!isVertical ? "sm:col-span-2" : ""}`}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        01 // Portfolio
      </p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className={`font-display text-foreground ${isVertical ? "text-5xl" : "text-6xl sm:text-7xl"}`}>
          {total}
        </span>
        <span className="text-sm text-muted-foreground">
          Across {uniqueStates} states
        </span>
      </div>
      <div className="mt-1">
        <p className="text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GROUP_META["lauf-built"].accent }} />
            {laufBuiltCount} lauf built
          </span>
          <span className="mx-1.5">·</span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GROUP_META["in-development"].accent }} />
            {inDevCount} in development
          </span>
          <span className="mx-1.5">·</span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GROUP_META["onboarding"].accent }} />
            {onboardingCount} onboarding
          </span>
          <span className="mx-1.5">·</span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GROUP_META["not-engaged"].accent }} />
            {notEngagedCount} not engaged
          </span>
        </p>
      </div>
      <div className="mt-4">
        <SegmentBar segments={segments} compact={isVertical} />
      </div>
    </div>
  );

  const cell02 = (
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
  );

  const cell03 = (
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
  );

  const cell04 = (
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
  );

  const cell05 = (
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
  );

  if (isVertical) {
    return (
      <div className="space-y-3">
        {cell01}
        {cell02}
        {cell03}
        {cell04}
        {cell05}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cell01}
        {cell02}
        {cell03}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cell04}
        {cell05}
      </div>
    </div>
  );
}
