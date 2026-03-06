"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import type { Location } from "@/types";
import { StatusPill } from "@/components/locations/StatusPill";
import { LighthouseScore } from "@/components/metrics/LighthouseScore";
import { PLATFORM_LABELS } from "@/lib/constants";

type SortKey = "name" | "city" | "migrationStatus" | "rebuildStatus" | "lighthousePerf";
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
        case "migrationStatus":
          av = a.migrationStatus;
          bv = b.migrationStatus;
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
    { key: "migrationStatus", label: "Migration" },
    { key: "rebuildStatus", label: "Rebuild" },
    { key: "lighthousePerf", label: "Lighthouse", className: "text-right" },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-card">
            {headers.map((h) => (
              <th
                key={h.key}
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground ${h.className ?? ""}`}
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
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Platform
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map((location) => (
            <tr
              key={location.id}
              className="bg-background transition-colors hover:bg-card"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/locations/${location.slug}`}
                  className="font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                >
                  {location.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {location.city}, {location.state}
              </td>
              <td className="px-4 py-3">
                <StatusPill status={location.migrationStatus} />
              </td>
              <td className="px-4 py-3">
                <StatusPill status={location.rebuildStatus} />
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
              <td className="px-4 py-3">
                {location.currentPlatform && (
                  <span className="rounded bg-muted px-2 py-0.5 font-[family-name:var(--font-geist-mono)] text-[11px] text-muted-foreground">
                    {PLATFORM_LABELS[location.currentPlatform] ??
                      location.currentPlatform}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
