"use client";

import { Star } from "lucide-react";
import type { Location, Competitor } from "@/types";
import { LighthouseScore } from "@/components/metrics/LighthouseScore";
import { getGradeColor, getGradeBgColor } from "@/lib/grading";

interface Props {
  location: Location;
  competitors: Competitor[];
}

interface RankedEntity {
  name: string;
  isEmbark: boolean;
  rating: number | null;
  reviews: number | null;
  lighthouseAvg: number | null;
  seoGrade: string | null;
  serviceCount: number;
}

const SERVICE_KEYS = [
  "serviceBoarding", "serviceDaycare", "serviceGrooming", "serviceTraining",
  "serviceVetCare", "serviceGroomingEd", "serviceWebcams", "serviceMobileGroom", "serviceRetail",
] as const;

export function CompetitorRankTable({ location, competitors }: Props) {
  const entities: RankedEntity[] = [
    {
      name: location.name,
      isEmbark: true,
      rating: location.googleRating,
      reviews: location.googleReviewCount,
      lighthouseAvg: lhAvg(location),
      seoGrade: null,
      serviceCount: SERVICE_KEYS.filter((k) => location[k]).length,
    },
    ...competitors.map((c) => ({
      name: c.name,
      isEmbark: false,
      rating: c.googleRating,
      reviews: c.googleReviewCount,
      lighthouseAvg: lhAvg(c),
      seoGrade: c.seoGrade,
      serviceCount: SERVICE_KEYS.filter((k) => c[k]).length,
    })),
  ];

  // Sort by rating descending
  entities.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Business</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Rating</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Reviews</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">LH Avg</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">SEO</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Services</th>
            </tr>
          </thead>
          <tbody>
            {entities.map((e, i) => (
              <tr
                key={e.name}
                className={`border-b border-border last:border-0 ${e.isEmbark ? "bg-primary/5" : ""}`}
              >
                <td className="px-4 py-2.5 font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
                  {i + 1}
                </td>
                <td className="px-4 py-2.5">
                  <span className={`font-display text-sm ${e.isEmbark ? "text-primary font-medium" : "text-foreground"}`}>
                    {e.name}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  {e.rating !== null ? (
                    <div className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="font-[family-name:var(--font-geist-mono)] text-sm">{e.rating.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/30">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-center font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
                  {e.reviews?.toLocaleString() ?? "—"}
                </td>
                <td className="px-4 py-2.5 text-center">
                  {e.lighthouseAvg !== null ? (
                    <div className="flex justify-center">
                      <LighthouseScore score={e.lighthouseAvg} size="sm" />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/30">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-center">
                  {e.seoGrade ? (
                    <span
                      className="rounded px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-[10px] font-medium"
                      style={{ color: getGradeColor(e.seoGrade), backgroundColor: getGradeBgColor(e.seoGrade) }}
                    >
                      {e.seoGrade}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/30">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-center font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
                  {e.serviceCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function lhAvg(entity: { lighthousePerf: number | null; lighthouseA11y: number | null; lighthouseSEO: number | null; lighthouseBP: number | null }): number | null {
  const scores = [entity.lighthousePerf, entity.lighthouseA11y, entity.lighthouseSEO, entity.lighthouseBP].filter((s): s is number => s !== null);
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}
