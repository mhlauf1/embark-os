import type { LocationWithRelations } from "@/types";
import { MIGRATION_STATUSES, MIGRATION_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check, AlertTriangle } from "lucide-react";

interface Props {
  location: LocationWithRelations;
}

export function MigrationTab({ location }: Props) {
  const currentIndex = MIGRATION_STATUSES.indexOf(
    location.migrationStatus as (typeof MIGRATION_STATUSES)[number]
  );

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
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                      isComplete && "bg-status-live-bg text-status-live",
                      isCurrent && "bg-status-complete-bg text-primary ring-2 ring-primary",
                      !isComplete && !isCurrent && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isComplete ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
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
      {location.migrationBlockedBy && (
        <div className="rounded-lg border border-destructive/20 bg-status-blocked-bg p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="text-sm font-medium text-destructive">Blocked</h3>
          </div>
          <p className="mt-2 text-sm text-foreground">
            {location.migrationBlockedBy}
          </p>
        </div>
      )}

      {/* Notes */}
      {location.migrationNotes && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            Migration Notes
          </h3>
          <p className="text-sm text-foreground">{location.migrationNotes}</p>
        </div>
      )}
    </div>
  );
}
