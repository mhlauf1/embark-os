import Link from "next/link";
import type { Location } from "@/types";
import { StatusPill } from "./StatusPill";
import { LighthouseScore } from "@/components/metrics/LighthouseScore";
import { PLATFORM_LABELS, MIGRATION_STATUS_LABELS, REBUILD_STATUS_LABELS } from "@/lib/constants";
import { SERVICE_LABELS, type ServiceKey } from "@/types";
import { CardHoverDetails } from "./CardHoverDetails";

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
  if (rebuildStatus === "live") return "#22c55e";
  if (["in-design", "in-development", "in-review", "scoped"].includes(rebuildStatus))
    return "#f59e0b";
  return "#52525b";
}

export function LocationCard({ location }: LocationCardProps) {
  const activeServices = SERVICE_KEYS.filter((key) => location[key]);
  const accent = getAccentColor(location.rebuildStatus);
  const migLabel = MIGRATION_STATUS_LABELS[location.migrationStatus] ?? location.migrationStatus;
  const rebLabel = REBUILD_STATUS_LABELS[location.rebuildStatus] ?? location.rebuildStatus;

  return (
    <Link
      href={`/locations/${location.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
      aria-label={`${location.name}, ${location.city} ${location.state}. Migration: ${migLabel}. Rebuild: ${rebLabel}`}
    >
      <div
        className="rounded-lg border border-border border-l-[3px] bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        style={{
          borderLeftColor: accent,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-xl text-foreground">
              {location.name}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {location.city}, {location.state}
            </p>
          </div>
        </div>

        {/* Status Row - always visible */}
        <div className="mt-3 flex items-center gap-2">
          <StatusPill status={location.migrationStatus} />
          <StatusPill status={location.rebuildStatus} />
          {location.currentPlatform && (
            <span className="ml-auto rounded bg-muted px-2 py-0.5 font-[family-name:var(--font-geist-mono)] text-[11px] text-muted-foreground">
              {PLATFORM_LABELS[location.currentPlatform] ??
                location.currentPlatform}
            </span>
          )}
        </div>

        {/* Hover details - services, URL, lighthouse */}
        <CardHoverDetails
          activeServices={activeServices}
          currentUrl={location.currentUrl}
          lighthousePerf={location.lighthousePerf}
        />
      </div>
    </Link>
  );
}
