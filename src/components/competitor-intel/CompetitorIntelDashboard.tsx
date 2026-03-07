"use client";

import type { MarketPosition } from "@/lib/market-position";
import type { Location, Competitor, CompetitorRatingSnapshot, RatingSnapshot, AIVisibilityCheck } from "@/types";
import { MarketTable } from "./MarketTable";
import { ReputationRaceChart } from "./ReputationRaceChart";
import { WebPerformanceGapChart } from "./WebPerformanceGapChart";
import { AIVisibilitySection } from "./AIVisibilitySection";
import { getGradeColor, getGradeBgColor } from "@/lib/grading";
import { Swords, Target, Star, Bot } from "lucide-react";
import { SectionDivider } from "@/components/shared/SectionDivider";

type LocationWithCompetitors = Location & {
  competitors: (Competitor & { ratingSnapshots: CompetitorRatingSnapshot[] })[];
  ratingSnapshots: RatingSnapshot[];
  aiVisibilityChecks: AIVisibilityCheck[];
};

interface Props {
  locations: LocationWithCompetitors[];
  positions: MarketPosition[];
  totalCompetitors: number;
  marketsTracked: number;
}

export function CompetitorIntelDashboard({
  locations,
  positions,
  totalCompetitors,
  marketsTracked,
}: Props) {
  const avgScore = positions.length > 0
    ? Math.round(positions.reduce((s, p) => s + p.compositeScore, 0) / positions.length)
    : 0;
  const avgGrade = avgScore >= 90 ? "A" : avgScore >= 80 ? "B" : avgScore >= 70 ? "C" : avgScore >= 60 ? "D" : "F";

  const ratingsWithDelta = positions.filter((p) => p.ratingDelta !== null);
  const avgRatingDelta = ratingsWithDelta.length > 0
    ? Math.round(ratingsWithDelta.reduce((s, p) => s + p.ratingDelta!, 0) / ratingsWithDelta.length * 10) / 10
    : null;

  const allAiChecks = locations.flatMap((l) => l.aiVisibilityChecks);
  const embarkMentions = allAiChecks.filter((c) => c.mentionsEmbark).length;
  const totalChecks = allAiChecks.length;

  return (
    <div className="space-y-8">
      {/* 01 // MARKET OVERVIEW */}
      <section>
        <SectionDivider number="01" title="Market Overview" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Competitors */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Swords className="h-4 w-4" />
              <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-widest">Total Competitors</span>
            </div>
            <p className="mt-2 font-display text-2xl text-foreground">{totalCompetitors}</p>
            <p className="mt-0.5 font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
              across {marketsTracked} markets
            </p>
          </div>

          {/* Avg Market Position */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-widest">Avg Market Position</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl text-foreground">{avgScore}</span>
              <span
                className="rounded px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-xs font-medium"
                style={{ color: getGradeColor(avgGrade), backgroundColor: getGradeBgColor(avgGrade) }}
              >
                {avgGrade}
              </span>
            </div>
            <p className="mt-0.5 font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
              composite score
            </p>
          </div>

          {/* Rating Advantage */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="h-4 w-4" />
              <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-widest">Rating Advantage</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              {avgRatingDelta !== null ? (
                <>
                  <span className="font-display text-2xl text-foreground">
                    {avgRatingDelta > 0 ? "+" : ""}{avgRatingDelta.toFixed(1)}
                  </span>
                  <span
                    className="rounded px-1.5 py-0.5 text-xs font-medium"
                    style={{
                      color: avgRatingDelta >= 0 ? "#4A9A6E" : "#C45C4A",
                      backgroundColor: avgRatingDelta >= 0 ? "rgba(74,154,110,0.1)" : "rgba(196,92,74,0.1)",
                    }}
                  >
                    {avgRatingDelta >= 0 ? "ahead" : "behind"}
                  </span>
                </>
              ) : (
                <span className="font-display text-2xl text-muted-foreground/30">—</span>
              )}
            </div>
            <p className="mt-0.5 font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
              vs avg competitor
            </p>
          </div>

          {/* AI Visibility */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bot className="h-4 w-4" />
              <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-widest">AI Visibility</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              {totalChecks > 0 ? (
                <span className="font-display text-2xl text-foreground">
                  {Math.round((embarkMentions / totalChecks) * 100)}%
                </span>
              ) : (
                <span className="font-display text-2xl text-muted-foreground/30">—</span>
              )}
            </div>
            <p className="mt-0.5 font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
              {totalChecks > 0 ? `${embarkMentions}/${totalChecks} mentions` : "no scans yet"}
            </p>
          </div>
        </div>
      </section>

      {/* 02 // MARKET-BY-MARKET */}
      <section>
        <SectionDivider number="02" title="Market-by-Market" />
        <MarketTable positions={positions} />
      </section>

      {/* 03 // REPUTATION RACE */}
      <section>
        <SectionDivider number="03" title="Reputation Race" />
        <ReputationRaceChart positions={positions} />
      </section>

      {/* 04 // WEB PERFORMANCE GAP */}
      <section>
        <SectionDivider number="04" title="Web Performance Gap" />
        <WebPerformanceGapChart positions={positions} />
      </section>

      {/* 05 // AI BRAND VISIBILITY */}
      <section>
        <SectionDivider number="05" title="AI Brand Visibility" />
        <AIVisibilitySection locations={locations} />
      </section>
    </div>
  );
}
