"use client";

import { Star } from "lucide-react";

interface StatsGridProps {
  total: number;
  uniqueStates: number;
  migrationsComplete: number;
  migrationsInProgress: number;
  rebuildsLive: number;
  rebuildsInProgress: number;
  liveCount: number;
  inProgressCount: number;
  notStartedCount: number;
  avgRating: number | null;
  totalReviews: number;
  ratedCount: number;
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
            <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-wider text-muted-foreground">
              {seg.label} ({seg.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniProgressBar({
  filled: filledCount,
  total,
  color,
}: {
  filled: number;
  total: number;
  color: string;
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full"
          style={{
            backgroundColor: i < filledCount ? color : "var(--border)",
          }}
        />
      ))}
    </div>
  );
}

export function StatsGrid({
  total,
  uniqueStates,
  migrationsComplete,
  migrationsInProgress,
  rebuildsLive,
  rebuildsInProgress,
  liveCount,
  inProgressCount,
  notStartedCount,
  avgRating,
  totalReviews,
  ratedCount,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Hero Cell */}
      <div className="rounded-lg border border-border bg-card p-5 sm:col-span-2">
        <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-muted-foreground">
          01 // Total Locations
        </p>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="font-display text-6xl text-foreground sm:text-7xl">
            {total}
          </span>
          <span className="font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
            Across {uniqueStates} states
          </span>
        </div>
        <div className="mt-5">
          <SegmentBar
            segments={[
              { count: liveCount, color: "#22c55e", label: "Live" },
              { count: inProgressCount, color: "#f59e0b", label: "In Progress" },
              { count: notStartedCount, color: "#e4e4e7", label: "Not Started" },
            ]}
          />
        </div>
      </div>

      {/* Migrations Cell */}
      <div className="rounded-lg border border-border bg-card p-5">
        <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-muted-foreground">
          02 // Migrations
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-3xl text-foreground">
            {migrationsComplete}
          </span>
          <span className="font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
            / {total}
          </span>
          <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wider text-muted-foreground">
            Complete
          </span>
        </div>
        <div className="mt-3">
          <MiniProgressBar
            filled={migrationsComplete}
            total={total}
            color="#22c55e"
          />
        </div>
      </div>

      {/* Rebuilds Cell */}
      <div className="rounded-lg border border-border bg-card p-5">
        <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-muted-foreground">
          03 // Rebuilds
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-3xl text-foreground">
            {rebuildsLive}
          </span>
          <span className="font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
            / {total}
          </span>
          <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wider text-muted-foreground">
            Live
          </span>
        </div>
        {rebuildsInProgress > 0 && (
          <p className="mt-1 font-[family-name:var(--font-geist-mono)] text-[11px] text-muted-foreground">
            +{rebuildsInProgress} in progress
          </p>
        )}
        <div className="mt-3">
          <MiniProgressBar
            filled={rebuildsLive}
            total={total}
            color="#22c55e"
          />
        </div>
      </div>

      {/* Reputation Cell */}
      <div className="rounded-lg border border-border bg-card p-5">
        <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-muted-foreground">
          04 // Reputation
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
        <p className="mt-1 font-[family-name:var(--font-geist-mono)] text-[11px] text-muted-foreground">
          {totalReviews.toLocaleString()} reviews across {ratedCount} locations
        </p>
      </div>
    </div>
  );
}
