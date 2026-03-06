import type { LocationWithRelations } from "@/types";
import { LighthouseScore } from "@/components/metrics/LighthouseScore";
import { ExternalLink } from "lucide-react";
import { PLATFORM_LABELS, REBUILD_STATUS_LABELS } from "@/lib/constants";

interface Props {
  location: LocationWithRelations;
}

export function SiteTab({ location }: Props) {
  const hasScores =
    location.lighthousePerf !== null ||
    location.lighthouseA11y !== null ||
    location.lighthouseSEO !== null ||
    location.lighthouseBP !== null;

  return (
    <div className="space-y-6">
      {/* Current Site */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Current Site
        </h3>
        <dl className="space-y-3">
          {location.currentUrl && (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">URL</dt>
              <dd>
                <a
                  href={location.currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-[family-name:var(--font-geist-mono)] text-sm text-primary hover:underline"
                >
                  {location.currentUrl.replace(/^https?:\/\//, "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </dd>
            </div>
          )}
          <InfoRow
            label="Platform"
            value={
              PLATFORM_LABELS[location.currentPlatform ?? ""] ??
              location.currentPlatform ??
              "Unknown"
            }
          />
          {location.currentTechStack && (
            <InfoRow label="Tech Stack" value={location.currentTechStack} />
          )}
        </dl>
      </div>

      {/* Lighthouse Scores */}
      {hasScores && (
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Lighthouse Scores
            </h3>
            {location.lighthouseAudited && (
              <span className="text-xs text-muted-foreground">
                Audited{" "}
                {new Date(location.lighthouseAudited).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="flex justify-around">
            {location.lighthousePerf !== null && (
              <LighthouseScore
                score={location.lighthousePerf}
                label="Performance"
              />
            )}
            {location.lighthouseA11y !== null && (
              <LighthouseScore
                score={location.lighthouseA11y}
                label="Accessibility"
              />
            )}
            {location.lighthouseSEO !== null && (
              <LighthouseScore
                score={location.lighthouseSEO}
                label="SEO"
              />
            )}
            {location.lighthouseBP !== null && (
              <LighthouseScore
                score={location.lighthouseBP}
                label="Best Practices"
              />
            )}
          </div>
        </div>
      )}

      {/* Rebuild Status */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Rebuild Status
        </h3>
        <dl className="space-y-3">
          <InfoRow
            label="Status"
            value={
              REBUILD_STATUS_LABELS[location.rebuildStatus] ??
              location.rebuildStatus
            }
          />
          {location.rebuildTemplate && (
            <InfoRow label="Template" value={location.rebuildTemplate} />
          )}
          {location.previewUrl && (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Preview</dt>
              <dd>
                <a
                  href={location.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-[family-name:var(--font-geist-mono)] text-sm text-primary hover:underline"
                >
                  {location.previewUrl.replace(/^https?:\/\//, "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </dd>
            </div>
          )}
          {location.targetLaunchDate && (
            <InfoRow
              label="Target Launch"
              value={new Date(
                location.targetLaunchDate
              ).toLocaleDateString()}
            />
          )}
          {location.liveUrl && (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Live URL</dt>
              <dd>
                <a
                  href={location.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-[family-name:var(--font-geist-mono)] text-sm text-primary hover:underline"
                >
                  {location.liveUrl.replace(/^https?:\/\//, "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}
