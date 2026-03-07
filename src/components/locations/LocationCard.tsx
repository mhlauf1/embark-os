import Link from "next/link";
import { Star } from "lucide-react";
import type { Location } from "@/types";
import { LighthouseScore } from "@/components/metrics/LighthouseScore";
import { PLATFORM_LABELS, REBUILD_STATUS_LABELS, MIGRATION_STATUS_LABELS } from "@/lib/constants";
import { type ServiceKey } from "@/types";
import { getLocationGroup, GROUP_META } from "@/lib/groupLocations";

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


function isMigrationActive(migrationStatus: string): boolean {
  return ["recon", "stakeholder-outreach", "access-gathered", "in-execution"].includes(migrationStatus);
}

export function LocationCard({ location }: LocationCardProps) {
  const activeServices = SERVICE_KEYS.filter((key) => location[key]);
  const tier = getLocationGroup(location);
  const accent = GROUP_META[tier].accent;
  const isLaufBuilt = tier === "lauf-built";
  const isNotEngaged = tier === "not-engaged";

  return (
    <Link
      href={`/locations/${location.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
      aria-label={`${location.name}, ${location.city} ${location.state}`}
    >
      <div className={`rounded-lg border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${isNotEngaged ? "opacity-65" : ""}`}>
        {/* Top accent bar */}
        <div className="h-0.5" style={{ backgroundColor: accent }} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-display text-lg text-foreground">
                  {location.name}
                </h3>
                {isLaufBuilt && (
                  <span className="shrink-0 rounded bg-[#E6F3EC] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#2D6A4F]">
                    Lauf
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {location.city}, {location.state}
              </p>
            </div>
            {location.lighthousePerf !== null && (
              <div className="ml-3 shrink-0">
                <LighthouseScore score={location.lighthousePerf} size="sm" />
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                {REBUILD_STATUS_LABELS[location.rebuildStatus] ?? location.rebuildStatus}
              </span>
            </div>
            {isMigrationActive(location.migrationStatus) && (
              <div className="mt-1 flex items-center gap-1.5 pl-3.5">
                <span className="text-[10px] text-muted-foreground">
                  Migration: {MIGRATION_STATUS_LABELS[location.migrationStatus] ?? location.migrationStatus}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-2">
              {location.currentPlatform && (
                <span className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {PLATFORM_LABELS[location.currentPlatform] ??
                    location.currentPlatform}
                </span>
              )}
              {location.googleRating !== null && (
                <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  {location.googleRating.toFixed(1)}
                </span>
              )}
            </div>
            {activeServices.length > 0 && (
              <span className="text-[11px] text-muted-foreground">
                {activeServices.length} services
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
