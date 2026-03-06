"use client";

import type { LocationWithRelations } from "@/types";
import { LighthouseScore } from "@/components/metrics/LighthouseScore";
import { AuditRunButton } from "@/components/audit/AuditRunButton";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { PLATFORM_LABELS, REBUILD_STATUS_LABELS, REBUILD_STATUSES, PLATFORMS } from "@/lib/constants";
import { InlineEditField } from "@/components/shared/InlineEditField";
import { InlineSelectField } from "@/components/shared/InlineSelectField";
import { StatusPill } from "../StatusPill";

interface Props {
  location: LocationWithRelations;
  onUpdate: (field: string, value: unknown) => Promise<boolean>;
}

const platformOptions = PLATFORMS.map((p) => ({
  value: p,
  label: PLATFORM_LABELS[p],
}));

const rebuildOptions = REBUILD_STATUSES.map((s) => ({
  value: s,
  label: REBUILD_STATUS_LABELS[s],
}));

export function SiteTab({ location, onUpdate }: Props) {
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
          <EditableInfoRow label="URL">
            <div className="flex items-center gap-2">
              <InlineEditField
                value={location.currentUrl ?? ""}
                onSave={(v) => onUpdate("currentUrl", v || null)}
                placeholder="Add URL"
                mono
              />
              {location.currentUrl && (
                <a
                  href={location.currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </EditableInfoRow>
          <EditableInfoRow label="Platform">
            <InlineSelectField
              value={location.currentPlatform ?? "unknown"}
              options={platformOptions}
              onSave={(v) => onUpdate("currentPlatform", v)}
            />
          </EditableInfoRow>
          <EditableInfoRow label="Tech Stack">
            <InlineEditField
              value={location.currentTechStack ?? ""}
              onSave={(v) => onUpdate("currentTechStack", v || null)}
              placeholder="Add tech stack"
            />
          </EditableInfoRow>
        </dl>
      </div>

      {/* Lighthouse Scores */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            Lighthouse Scores
          </h3>
          <div className="flex items-center gap-2">
            {location.lighthouseAudited && (
              <span className="text-xs text-muted-foreground">
                Audited{" "}
                {new Date(location.lighthouseAudited).toLocaleDateString()}
              </span>
            )}
            {location.currentUrl && (
              <AuditRunButton locationId={location.id} size="sm" />
            )}
          </div>
        </div>
        <div className="flex justify-around">
          <ScoreWithEdit
            score={location.lighthousePerf}
            label="Performance"
            field="lighthousePerf"
            onUpdate={onUpdate}
          />
          <ScoreWithEdit
            score={location.lighthouseA11y}
            label="Accessibility"
            field="lighthouseA11y"
            onUpdate={onUpdate}
          />
          <ScoreWithEdit
            score={location.lighthouseSEO}
            label="SEO"
            field="lighthouseSEO"
            onUpdate={onUpdate}
          />
          <ScoreWithEdit
            score={location.lighthouseBP}
            label="Best Practices"
            field="lighthouseBP"
            onUpdate={onUpdate}
          />
        </div>
      </div>

      {/* Audit Link */}
      <div className="flex justify-end">
        <Link
          href={`/audit/${location.id}`}
          className="text-xs text-primary hover:text-primary/80"
        >
          View full audit report &rarr;
        </Link>
      </div>

      {/* Rebuild Status */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Rebuild Status
        </h3>
        <dl className="space-y-3">
          <EditableInfoRow label="Status">
            <StatusPill
              status={location.rebuildStatus}
              label={REBUILD_STATUS_LABELS[location.rebuildStatus]}
              options={rebuildOptions}
              onSave={(v) => onUpdate("rebuildStatus", v)}
            />
          </EditableInfoRow>
          <EditableInfoRow label="Template">
            <InlineEditField
              value={location.rebuildTemplate ?? ""}
              onSave={(v) => onUpdate("rebuildTemplate", v || null)}
              placeholder="Assign template"
            />
          </EditableInfoRow>
          <EditableInfoRow label="Preview URL">
            <div className="flex items-center gap-2">
              <InlineEditField
                value={location.previewUrl ?? ""}
                onSave={(v) => onUpdate("previewUrl", v || null)}
                placeholder="Add preview URL"
                mono
              />
              {location.previewUrl && (
                <a
                  href={location.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </EditableInfoRow>
          <EditableInfoRow label="Live URL">
            <div className="flex items-center gap-2">
              <InlineEditField
                value={location.liveUrl ?? ""}
                onSave={(v) => onUpdate("liveUrl", v || null)}
                placeholder="Add live URL"
                mono
              />
              {location.liveUrl && (
                <a
                  href={location.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </EditableInfoRow>
        </dl>
      </div>
    </div>
  );
}

function ScoreWithEdit({
  score,
  label,
  field,
  onUpdate,
}: {
  score: number | null;
  label: string;
  field: string;
  onUpdate: (field: string, value: unknown) => Promise<boolean>;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <LighthouseScore score={score ?? 0} label={label} />
      <InlineEditField
        value={score?.toString() ?? ""}
        onSave={async (v) => {
          const num = v === "" ? null : parseInt(v, 10);
          if (num !== null && (isNaN(num) || num < 0 || num > 100)) return false;
          return onUpdate(field, num);
        }}
        placeholder="—"
        className="text-center"
      />
    </div>
  );
}

function EditableInfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
