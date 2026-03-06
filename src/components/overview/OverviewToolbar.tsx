"use client";

import { LayoutGrid, List, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MIGRATION_STATUS_LABELS,
  REBUILD_STATUS_LABELS,
  PLATFORM_LABELS,
} from "@/lib/constants";

export type ViewMode = "grouped" | "list";

export interface Filters {
  migrationStatus: string;
  rebuildStatus: string;
  platform: string;
}

interface OverviewToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function OverviewToolbar({
  viewMode,
  onViewModeChange,
  filters,
  onFilterChange,
}: OverviewToolbarProps) {
  const hasActiveFilters =
    filters.migrationStatus !== "all" ||
    filters.rebuildStatus !== "all" ||
    filters.platform !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* View Toggle */}
      <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
        <button
          onClick={() => onViewModeChange("grouped")}
          aria-pressed={viewMode === "grouped"}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wider transition-colors ${
            viewMode === "grouped"
              ? "bg-border text-foreground"
              : "text-muted-foreground hover:text-muted-foreground"
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Cards
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          aria-pressed={viewMode === "list"}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wider transition-colors ${
            viewMode === "list"
              ? "bg-border text-foreground"
              : "text-muted-foreground hover:text-muted-foreground"
          }`}
        >
          <List className="h-3.5 w-3.5" />
          List
        </button>
      </div>

      <div className="h-5 w-px bg-border" />

      {/* Filters */}
      <Select
        value={filters.migrationStatus}
        onValueChange={(v) =>
          onFilterChange({ ...filters, migrationStatus: v })
        }
      >
        <SelectTrigger size="sm" className="h-7 border-border bg-card text-xs text-muted-foreground">
          <SelectValue placeholder="Migration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Migration</SelectItem>
          {Object.entries(MIGRATION_STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.rebuildStatus}
        onValueChange={(v) =>
          onFilterChange({ ...filters, rebuildStatus: v })
        }
      >
        <SelectTrigger size="sm" className="h-7 border-border bg-card text-xs text-muted-foreground">
          <SelectValue placeholder="Rebuild" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Rebuild</SelectItem>
          {Object.entries(REBUILD_STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.platform}
        onValueChange={(v) =>
          onFilterChange({ ...filters, platform: v })
        }
      >
        <SelectTrigger size="sm" className="h-7 border-border bg-card text-xs text-muted-foreground">
          <SelectValue placeholder="Platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Platforms</SelectItem>
          {Object.entries(PLATFORM_LABELS)
            .filter(([v]) => v !== "unknown" && v !== "none")
            .map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <button
          onClick={() =>
            onFilterChange({
              migrationStatus: "all",
              rebuildStatus: "all",
              platform: "all",
            })
          }
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-muted-foreground"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  );
}
