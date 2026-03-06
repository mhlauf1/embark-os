"use client";

import type { LocationWithRelations } from "@/types";
import { MIGRATION_STATUSES, MIGRATION_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check, AlertTriangle } from "lucide-react";
import { InlineEditField } from "@/components/shared/InlineEditField";

interface Props {
  location: LocationWithRelations;
  onUpdate: (field: string, value: unknown) => Promise<boolean>;
}

export function MigrationTab({ location, onUpdate }: Props) {
  const currentIndex = MIGRATION_STATUSES.indexOf(
    location.migrationStatus as (typeof MIGRATION_STATUSES)[number]
  );

  async function handleStepClick(status: string) {
    if (status === location.migrationStatus) return;
    await onUpdate("migrationStatus", status);
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Steps */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-6 text-sm font-medium text-muted-foreground">
          Migration Pipeline
        </h3>
        <div className="flex items-center gap-2">
          {MIGRATION_STATUSES.map((status, i) => {
            const isComplete = i < currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <div key={status} className="flex flex-1 items-center gap-2">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleStepClick(status)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors cursor-pointer hover:ring-2 hover:ring-primary/30",
                      isComplete && "bg-status-live-bg text-status-live",
                      isCurrent && "bg-status-complete-bg text-primary ring-2 ring-primary",
                      !isComplete && !isCurrent && "bg-muted text-muted-foreground"
                    )}
                    title={`Set to: ${MIGRATION_STATUS_LABELS[status]}`}
                  >
                    {isComplete ? <Check className="h-4 w-4" /> : i + 1}
                  </button>
                  <span
                    className={cn(
                      "mt-2 text-center text-[10px] leading-tight",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {MIGRATION_STATUS_LABELS[status]}
                  </span>
                </div>
                {i < MIGRATION_STATUSES.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1",
                      i < currentIndex ? "bg-status-live" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Blocked By */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <h3 className="text-sm font-medium text-muted-foreground">Blocked By</h3>
        </div>
        <InlineEditField
          value={location.migrationBlockedBy ?? ""}
          onSave={(v) => onUpdate("migrationBlockedBy", v || null)}
          placeholder="No blockers"
          multiline
        />
      </div>

      {/* Notes */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Migration Notes
        </h3>
        <InlineEditField
          value={location.migrationNotes ?? ""}
          onSave={(v) => onUpdate("migrationNotes", v || null)}
          placeholder="Add migration notes"
          multiline
        />
      </div>
    </div>
  );
}
