"use client";

import { Star, ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Competitor } from "@/types";
import { type ServiceKey, SERVICE_LABELS } from "@/types";
import { LighthouseScore } from "@/components/metrics/LighthouseScore";

const SERVICE_KEYS: ServiceKey[] = [
  "serviceBoarding", "serviceDaycare", "serviceGrooming", "serviceTraining",
  "serviceVetCare", "serviceGroomingEd", "serviceWebcams", "serviceMobileGroom", "serviceRetail",
];

interface CompetitorCardProps {
  competitor: Competitor;
  onEdit: () => void;
  onDelete: () => void;
}

export function CompetitorCard({ competitor, onEdit, onDelete }: CompetitorCardProps) {
  const activeServices = SERVICE_KEYS.filter((key) => competitor[key]);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-display text-base text-foreground">{competitor.name}</h4>
          {competitor.url && (
            <a
              href={competitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {new URL(competitor.url).hostname} <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <div className="ml-2 flex items-center gap-1">
          <button onClick={onEdit} className="rounded-md p-1 text-muted-foreground hover:text-foreground">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} className="rounded-md p-1 text-muted-foreground hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Rating */}
      {competitor.googleRating !== null && (
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="font-[family-name:var(--font-geist-mono)] text-sm text-foreground">
              {competitor.googleRating?.toFixed(1)}
            </span>
          </div>
          {competitor.googleReviewCount !== null && (
            <span className="font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
              {competitor.googleReviewCount?.toLocaleString()} reviews
            </span>
          )}
        </div>
      )}

      {/* Services */}
      {activeServices.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {activeServices.map((key) => (
            <span key={key} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              {SERVICE_LABELS[key]}
            </span>
          ))}
        </div>
      )}

      {/* Lighthouse scores */}
      {competitor.lighthousePerf !== null && (
        <div className="mt-3 flex gap-3">
          <LighthouseScore score={competitor.lighthousePerf!} size="sm" label="Perf" />
          {competitor.lighthouseA11y !== null && (
            <LighthouseScore score={competitor.lighthouseA11y!} size="sm" label="A11y" />
          )}
          {competitor.lighthouseSEO !== null && (
            <LighthouseScore score={competitor.lighthouseSEO!} size="sm" label="SEO" />
          )}
        </div>
      )}

      {competitor.notes && (
        <p className="mt-3 text-xs text-muted-foreground">{competitor.notes}</p>
      )}
    </div>
  );
}
