import Link from "next/link";
import { Star } from "lucide-react";
import type { Location } from "@/types";
import { LighthouseScore } from "@/components/metrics/LighthouseScore";
import { PipelineTrack } from "@/components/overview/PipelineTrack";
import { PLATFORM_LABELS } from "@/lib/constants";
import { type ServiceKey } from "@/types";

interface LocationCardProps {
  location: Location;
}

const SERVICE_KEYS: ServiceKey[] = [
  "serviceBoarding",
  "serviceDaycare",
  "serviceGrooming",
  "serviceTraining",
  "serviceVetCare",
  "serviceGroomingEd",
  "serviceWebcams",
  "serviceMobileGroom",
  "serviceRetail",
];

function getAccentColor(rebuildStatus: string): string {
  if (rebuildStatus === "live") return "var(--success)";
  if (["in-design", "in-development", "in-review", "scoped"].includes(rebuildStatus))
    return "var(--warning)";
  return "var(--muted-foreground)";
}

export function LocationCard({ location }: LocationCardProps) {
  const activeServices = SERVICE_KEYS.filter((key) => location[key]);
  const accent = getAccentColor(location.rebuildStatus);

  return (
    <Link
      href={`/locations/${location.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
      aria-label={`${location.name}, ${location.city} ${location.state}`}
    >
      <div className="rounded-lg border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        {/* Top accent bar */}
        <div className="h-0.5" style={{ backgroundColor: accent }} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-display text-lg text-foreground">
                {location.name}
              </h3>
              <p className="mt-0.5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wider text-muted-foreground">
                {location.city}, {location.state}
              </p>
            </div>
            {location.lighthousePerf !== null && (
              <div className="ml-3 shrink-0">
                <LighthouseScore score={location.lighthousePerf} size="sm" />
              </div>
            )}
          </div>

          {/* Pipeline Tracks */}
          <div className="mt-4 space-y-3">
            <PipelineTrack
              pipeline="migration"
              status={location.migrationStatus}
            />
            <PipelineTrack
              pipeline="rebuild"
              status={location.rebuildStatus}
            />
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-2">
              {location.currentPlatform && (
                <span className="rounded bg-muted px-2 py-0.5 font-[family-name:var(--font-geist-mono)] text-[11px] text-muted-foreground">
                  {PLATFORM_LABELS[location.currentPlatform] ??
                    location.currentPlatform}
                </span>
              )}
              {location.googleRating !== null && (
                <span className="flex items-center gap-0.5 font-[family-name:var(--font-geist-mono)] text-[11px] text-muted-foreground">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  {location.googleRating.toFixed(1)}
                </span>
              )}
            </div>
            {activeServices.length > 0 && (
              <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-muted-foreground">
                {activeServices.length} services
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
