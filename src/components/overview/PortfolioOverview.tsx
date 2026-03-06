"use client";

import { useMemo } from "react";
import type { Location } from "@/types";
import { useUIStore } from "@/store/ui.store";
import { OverviewToolbar, type Filters, type ViewMode } from "./OverviewToolbar";
import { PortfolioGroupedView } from "./PortfolioGroupedView";
import { PortfolioListView } from "./PortfolioListView";
import { useState } from "react";

interface PortfolioOverviewProps {
  locations: Location[];
}

export function PortfolioOverview({ locations }: PortfolioOverviewProps) {
  const viewMode = useUIStore((s) => s.overviewViewMode);
  const setViewMode = useUIStore((s) => s.setOverviewViewMode);
  const [filters, setFilters] = useState<Filters>({
    migrationStatus: "all",
    rebuildStatus: "all",
    platform: "all",
  });

  const filtered = useMemo(() => {
    return locations.filter((l) => {
      if (
        filters.migrationStatus !== "all" &&
        l.migrationStatus !== filters.migrationStatus
      )
        return false;
      if (
        filters.rebuildStatus !== "all" &&
        l.rebuildStatus !== filters.rebuildStatus
      )
        return false;
      if (
        filters.platform !== "all" &&
        l.currentPlatform !== filters.platform
      )
        return false;
      return true;
    });
  }, [locations, filters]);

  return (
    <div className="space-y-5">
      <OverviewToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode as (mode: ViewMode) => void}
        filters={filters}
        onFilterChange={setFilters}
      />

      {viewMode === "grouped" ? (
        <PortfolioGroupedView locations={filtered} />
      ) : (
        <PortfolioListView locations={filtered} />
      )}
    </div>
  );
}
