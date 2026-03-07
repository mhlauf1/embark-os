"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpDown, Star } from "lucide-react";
import type { Location } from "@/types";
import { LighthouseScore } from "@/components/metrics/LighthouseScore";
import { REBUILD_STATUS_LABELS, MIGRATION_STATUS_LABELS } from "@/lib/constants";
import { getLocationGroup, GROUP_META } from "@/lib/groupLocations";

function isMigrationActive(migrationStatus: string): boolean {
  return ["recon", "stakeholder-outreach", "access-gathered", "in-execution"].includes(migrationStatus);
}

type SortKey = "name" | "city" | "googleRating" | "rebuildStatus" | "lighthousePerf";
type SortDir = "asc" | "desc";

interface PortfolioListViewProps {
  locations: Location[];
}

export function PortfolioListView({ locations }: PortfolioListViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => {
    return [...locations].sort((a, b) => {
      let av: string | number | null;
      let bv: string | number | null;

      switch (sortKey) {
        case "name":
          av = a.name;
          bv = b.name;
          break;
        case "city":
          av = `${a.city}, ${a.state}`;
          bv = `${b.city}, ${b.state}`;
          break;
        case "googleRating":
          av = a.googleRating ?? -1;
          bv = b.googleRating ?? -1;
          break;
        case "rebuildStatus":
          av = a.rebuildStatus;
          bv = b.rebuildStatus;
          break;
        case "lighthousePerf":
          av = a.lighthousePerf ?? -1;
          bv = b.lighthousePerf ?? -1;
          break;
      }

      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [locations, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const headers: { key: SortKey; label: string; className?: string }[] = [
    { key: "name", label: "Name" },
    { key: "city", label: "Location" },
    { key: "googleRating", label: "Rating" },
    { key: "rebuildStatus", label: "Status" },
    { key: "lighthousePerf", label: "Lighthouse", className: "text-right" },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[800px] text-sm">
        <thead>
          <tr className="border-b border-border bg-card">
            {headers.map((h) => (
              <th
                key={h.key}
                className={`px-4 py-3 text-left font-[family-name:var(--font-geist-mono)] text-[11px] font-medium uppercase tracking-wider text-muted-foreground ${h.className ?? ""}`}
              >
                <button
                  onClick={() => toggleSort(h.key)}
                  className="inline-flex items-center gap-1 hover:text-muted-foreground"
                >
                  {h.label}
                  <ArrowUpDown
                    className={`h-3 w-3 ${sortKey === h.key ? "text-muted-foreground" : "text-muted-foreground/70"}`}
                  />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map((location) => {
            const tier = getLocationGroup(location);
            const meta = GROUP_META[tier];
            return (
              <tr
                key={location.id}
                className={`bg-background transition-colors hover:bg-card ${tier === "not-engaged" ? "opacity-65" : ""}`}
              >
                <td
                  className="px-4 py-3"
                  style={{ borderLeft: `3px solid ${meta.accent}` }}
                >
                  <Link
                    href={`/locations/${location.slug}`}
                    className="font-display text-base text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                  >
                    {location.name}
                  </Link>
                </td>
                <td className="px-4 py-3 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wider text-muted-foreground">
                  {location.city}, {location.state}
                </td>
                <td className="px-4 py-3">
                  {location.googleRating !== null ? (
                    <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span>{location.googleRating.toFixed(1)}</span>
                      {location.googleReviewCount !== null && (
                        <span className="text-muted-foreground/70">
                          ({location.googleReviewCount})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">&mdash;</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: meta.accent }}
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {REBUILD_STATUS_LABELS[location.rebuildStatus] ?? location.rebuildStatus}
                    </span>
                  </div>
                  {isMigrationActive(location.migrationStatus) && (
                    <div className="mt-0.5 pl-3.5">
                      <span className="text-[10px] text-muted-foreground">
                        Migration: {MIGRATION_STATUS_LABELS[location.migrationStatus] ?? location.migrationStatus}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {location.lighthousePerf !== null ? (
                    <LighthouseScore
                      score={location.lighthousePerf}
                      size="sm"
                      aria-label={`Lighthouse score: ${location.lighthousePerf}`}
                    />
                  ) : (
                    <span className="text-muted-foreground">&mdash;</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
