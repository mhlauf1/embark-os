"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import type { Location } from "@/types";
import { PLATFORM_LABELS } from "@/lib/constants";
import { getLocationGroup, GROUP_META } from "@/lib/groupLocations";
import { GripVertical, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  location: Location;
  statusField: "migrationStatus" | "rebuildStatus";
  isDragOverlay?: boolean;
}

export function KanbanCard({
  location,
  statusField,
  isDragOverlay,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: location.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const blockedBy =
    statusField === "migrationStatus"
      ? location.migrationBlockedBy
      : null;

  const tier = getLocationGroup(location);
  const tierMeta = GROUP_META[tier];

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, borderTop: `3px solid ${tierMeta.accent}` }}
      className={cn(
        "rounded-md border border-border bg-background p-3 transition-shadow",
        isDragging && "opacity-50",
        isDragOverlay && "shadow-lg shadow-primary/10 border-primary/30",
        tier === "not-engaged" && "opacity-60"
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab text-muted-foreground hover:text-muted-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <div className="min-w-0 flex-1">
          <Link
            href={`/locations/${location.slug}`}
            className="font-display text-sm font-medium text-foreground hover:text-primary"
          >
            {location.name}
          </Link>
          <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-wider text-muted-foreground">
            {location.city}, {location.state}
          </p>
          {location.currentPlatform && (
            <span className="mt-1 inline-block font-[family-name:var(--font-geist-mono)] text-[10px] text-muted-foreground">
              {PLATFORM_LABELS[location.currentPlatform] ?? location.currentPlatform}
            </span>
          )}
          {blockedBy && (
            <div className="mt-2 flex items-center gap-1 text-[11px] text-destructive">
              <AlertTriangle className="h-3 w-3" />
              <span className="truncate">{blockedBy}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
