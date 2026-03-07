"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowRight, Star, ExternalLink } from "lucide-react";
import type { LocationWithRelations } from "@/types";
import { CompetitorForm } from "@/components/competitors/CompetitorForm";

interface CompetitorsTabProps {
  location: LocationWithRelations;
}

export function CompetitorsTab({ location }: CompetitorsTabProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Local Competitors</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {location.competitors.length} competitor{location.competitors.length !== 1 ? "s" : ""} in the {location.city} market
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/competitors/${location.id}`}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Full Market View
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Competitor
          </button>
        </div>
      </div>

      {/* Quick competitor list */}
      {location.competitors.length > 0 ? (
        <div className="rounded-lg border border-border bg-card">
          <div className="divide-y divide-border">
            {location.competitors.map((comp) => (
              <div key={comp.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm text-foreground">{comp.name}</span>
                    {comp.url && (
                      <a
                        href={comp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground/50 hover:text-muted-foreground"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {comp.seoGrade && (
                      <span className="rounded bg-muted px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-[10px] text-muted-foreground">
                        SEO {comp.seoGrade}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {comp.googleRating !== null && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="font-[family-name:var(--font-geist-mono)] text-sm text-foreground">
                        {comp.googleRating?.toFixed(1)}
                      </span>
                      {comp.googleReviewCount !== null && (
                        <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-muted-foreground">
                          ({comp.googleReviewCount})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border px-4 py-2.5">
            <Link
              href={`/competitors/${location.id}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View full competitive analysis — audits, rankings, trends, AI visibility
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No competitors added yet. Add local competitors to track this market.
          </p>
        </div>
      )}

      {/* Form Dialog */}
      {showForm && (
        <CompetitorForm
          locationId={location.id}
          onClose={() => {
            setShowForm(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
