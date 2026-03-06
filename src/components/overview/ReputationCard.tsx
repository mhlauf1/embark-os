"use client";

import { Star } from "lucide-react";

interface ReputationCardProps {
  avgRating: number | null;
  totalReviews: number;
  ratedCount: number;
  total: number;
}

export function ReputationCard({ avgRating, totalReviews, ratedCount, total }: ReputationCardProps) {
  return (
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
  );
}
