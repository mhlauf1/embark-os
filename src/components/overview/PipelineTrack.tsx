"use client";

import {
  MIGRATION_STATUSES,
  REBUILD_STATUSES,
  MIGRATION_STATUS_LABELS,
  REBUILD_STATUS_LABELS,
} from "@/lib/constants";

type Pipeline = "migration" | "rebuild";

interface PipelineTrackProps {
  pipeline: Pipeline;
  status: string;
  compact?: boolean;
}

const STAGES: Record<Pipeline, readonly string[]> = {
  migration: MIGRATION_STATUSES,
  rebuild: REBUILD_STATUSES,
};

const LABELS: Record<Pipeline, Record<string, string>> = {
  migration: MIGRATION_STATUS_LABELS,
  rebuild: REBUILD_STATUS_LABELS,
};

function getSegmentColor(filled: boolean, isComplete: boolean): string {
  if (!filled) return "#E5DFD7";
  if (isComplete) return "#4A9A6E";
  return "#CB8A40";
}

export function PipelineTrack({ pipeline, status, compact = false }: PipelineTrackProps) {
  const stages = STAGES[pipeline];
  const labels = LABELS[pipeline];
  const currentIndex = stages.indexOf(status);
  const filledCount = currentIndex + 1;
  const isComplete = currentIndex === stages.length - 1;
  const label = pipeline.toUpperCase();
  const stageName = labels[status] ?? status;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {stages.map((stage, i) => {
          const filled = i < filledCount;
          return (
            <div
              key={stage}
              className="h-1.5 flex-1 rounded-full"
              style={{ backgroundColor: getSegmentColor(filled, isComplete) }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-wider text-muted-foreground">
          {stageName}
        </span>
      </div>
      <div className="flex gap-1">
        {stages.map((stage, i) => {
          const filled = i < filledCount;
          return (
            <div
              key={stage}
              className="h-1.5 flex-1 rounded-full"
              style={{ backgroundColor: getSegmentColor(filled, isComplete) }}
            />
          );
        })}
      </div>
    </div>
  );
}
