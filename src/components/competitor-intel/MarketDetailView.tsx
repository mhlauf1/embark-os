"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, ScanSearch, Target, Star, Zap, Bot } from "lucide-react";
import type { Location, RatingSnapshot, AIVisibilityCheck } from "@/types";
import type { CompetitorWithSnapshots } from "@/types";
import type { MarketPosition } from "@/lib/market-position";
import { CompetitorCard } from "@/components/competitors/CompetitorCard";
import { CompetitorForm } from "@/components/competitors/CompetitorForm";
import { CompetitorComparison } from "@/components/competitors/CompetitorComparison";
import { CompetitorRankTable } from "./CompetitorRankTable";
import { RatingTrendChart } from "./RatingTrendChart";
import { ServiceOverlapMatrix } from "./ServiceOverlapMatrix";
import { MarketAIVisibility } from "./MarketAIVisibility";
import { getGradeColor, getGradeBgColor } from "@/lib/grading";

interface Props {
  location: Location;
  competitors: CompetitorWithSnapshots[];
  position: MarketPosition;
  ratingSnapshots: RatingSnapshot[];
  aiVisibilityChecks: AIVisibilityCheck[];
}

export function MarketDetailView({ location, competitors, position, ratingSnapshots, aiVisibilityChecks }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [auditingAll, setAuditingAll] = useState(false);
  const [auditProgress, setAuditProgress] = useState("");

  const editingCompetitor = editingId
    ? competitors.find((c) => c.id === editingId)
    : undefined;

  const competitorsWithUrls = competitors.filter((c) => c.url);

  async function handleDelete(id: string) {
    await fetch(`/api/competitors/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleAuditAll() {
    setAuditingAll(true);
    for (let i = 0; i < competitorsWithUrls.length; i++) {
      const comp = competitorsWithUrls[i];
      setAuditProgress(`${i + 1}/${competitorsWithUrls.length}: ${comp.name}`);
      try {
        await fetch(`/api/competitors/${comp.id}/audit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ strategy: "both" }),
        });
      } catch {
        // Continue with next competitor
      }
    }
    setAuditingAll(false);
    setAuditProgress("");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* 01 // MARKET POSITION */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <span className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wider text-muted-foreground">
            01 // MARKET POSITION
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span className="text-xs">Market Score</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl text-foreground">{position.compositeScore}</span>
              <span
                className="rounded px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-xs font-medium"
                style={{ color: getGradeColor(position.letterGrade), backgroundColor: getGradeBgColor(position.letterGrade) }}
              >
                {position.letterGrade}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="h-4 w-4" />
              <span className="text-xs">Rating Delta</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              {position.ratingDelta !== null ? (
                <>
                  <span className="font-display text-2xl text-foreground">
                    {position.ratingDelta > 0 ? "+" : ""}{position.ratingDelta.toFixed(1)}
                  </span>
                  <span
                    className="rounded px-1.5 py-0.5 text-xs font-medium"
                    style={{
                      color: position.ratingDelta >= 0 ? "#22c55e" : "#ef4444",
                      backgroundColor: position.ratingDelta >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    }}
                  >
                    vs {position.avgCompRating?.toFixed(1)} avg
                  </span>
                </>
              ) : (
                <span className="text-2xl text-muted-foreground/30">—</span>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span className="text-xs">Lighthouse Gap</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              {position.lighthouseGap !== null ? (
                <>
                  <span className="font-display text-2xl text-foreground">
                    {position.lighthouseGap > 0 ? "+" : ""}{position.lighthouseGap}
                  </span>
                  <span className="font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">pts</span>
                </>
              ) : (
                <span className="text-2xl text-muted-foreground/30">—</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 02 // COMPETITORS */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <span className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wider text-muted-foreground">
            02 // COMPETITORS
          </span>
          <div className="h-px flex-1 bg-border" />
          <div className="flex items-center gap-2">
            {competitorsWithUrls.length > 0 && (
              <button
                onClick={handleAuditAll}
                disabled={auditingAll}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
              >
                {auditingAll ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>{auditProgress}</span>
                  </>
                ) : (
                  <>
                    <ScanSearch className="h-3.5 w-3.5" />
                    Audit All
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => { setEditingId(null); setShowForm(true); }}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Competitor
            </button>
          </div>
        </div>

        {competitors.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {competitors.map((competitor) => (
              <CompetitorCard
                key={competitor.id}
                competitor={competitor}
                onEdit={() => { setEditingId(competitor.id); setShowForm(true); }}
                onDelete={() => handleDelete(competitor.id)}
                onRefresh={() => router.refresh()}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No competitors added yet. Add local competitors to track this market.
            </p>
          </div>
        )}
      </section>

      {/* 03 // COMPARISON */}
      {competitors.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wider text-muted-foreground">
              03 // COMPARISON
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <CompetitorComparison location={location} competitors={competitors} />
        </section>
      )}

      {/* 04 // RANKINGS */}
      {competitors.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wider text-muted-foreground">
              04 // RANKINGS
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <CompetitorRankTable location={location} competitors={competitors} />
        </section>
      )}

      {/* 05 // RATING TRENDS */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <span className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wider text-muted-foreground">
            05 // RATING TRENDS
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <RatingTrendChart
          locationName={location.name}
          ratingSnapshots={ratingSnapshots}
          competitors={competitors}
        />
      </section>

      {/* 06 // SERVICE COVERAGE */}
      {competitors.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wider text-muted-foreground">
              06 // SERVICE COVERAGE
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <ServiceOverlapMatrix location={location} competitors={competitors} />
        </section>
      )}

      {/* 07 // AI BRAND VISIBILITY */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <span className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wider text-muted-foreground">
            07 // AI BRAND VISIBILITY
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <MarketAIVisibility
          locationId={location.id}
          locationName={location.name}
          checks={aiVisibilityChecks}
        />
      </section>

      {/* Form Dialog */}
      {showForm && (
        <CompetitorForm
          locationId={location.id}
          competitor={editingCompetitor}
          onClose={() => { setShowForm(false); setEditingId(null); }}
        />
      )}
    </div>
  );
}
