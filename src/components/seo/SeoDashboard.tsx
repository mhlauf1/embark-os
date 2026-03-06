"use client";

import Link from "next/link";
import type { Location, SeoSnapshot, SeoCheckResult } from "@/types";
import { GradePill } from "@/components/audit/GradePill";
import { SeoRunButton, SeoRunAllButton } from "./SeoRunButton";
import { SeoStatusIcons } from "./SeoCheckList";
import { SeoComparisonChart } from "./SeoComparisonChart";
import { getLetterGrade, getGradeColor } from "@/lib/grading";
import { Eye } from "lucide-react";

interface SeoDashboardProps {
  locations: Location[];
  latestSnapshots: SeoSnapshot[];
}

export function SeoDashboard({
  locations,
  latestSnapshots,
}: SeoDashboardProps) {
  const locationsWithSeo = locations.map((loc) => {
    const snapshot = latestSnapshots.find((s) => s.locationId === loc.id);
    const checks: SeoCheckResult[] = snapshot
      ? JSON.parse(snapshot.checkResults)
      : [];
    return { location: loc, snapshot, checks };
  });

  const crawledLocations = locationsWithSeo.filter((l) => l.snapshot);

  const avgScore =
    crawledLocations.length > 0
      ? crawledLocations.reduce(
          (sum, l) => sum + (l.snapshot?.overallScore ?? 0),
          0
        ) / crawledLocations.length
      : 0;

  const avgGrade = crawledLocations.length > 0 ? getLetterGrade(avgScore) : "—";

  // Pass/warn/fail distribution across all checks
  const allChecks = crawledLocations.flatMap((l) => l.checks);
  const passCount = allChecks.filter((c) => c.status === "pass").length;
  const warnCount = allChecks.filter((c) => c.status === "warn").length;
  const failCount = allChecks.filter((c) => c.status === "fail").length;

  const lastCrawlDate =
    latestSnapshots.length > 0
      ? new Date(
          Math.max(
            ...latestSnapshots.map((s) => new Date(s.createdAt).getTime())
          )
        ).toLocaleDateString()
      : null;

  const crawlableLocationIds = locations
    .filter((l) => l.currentUrl)
    .map((l) => l.id);

  return (
    <div className="space-y-8">
      {/* 01 // PORTFOLIO SEO HEALTH */}
      <div>
        <div className="mb-4 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-muted-foreground">
          01 // Portfolio SEO Health
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">Average Grade</div>
            <div className="mt-2">
              {avgGrade !== "—" ? (
                <span
                  className="font-display text-4xl font-bold"
                  style={{ color: getGradeColor(avgGrade) }}
                >
                  {avgGrade}
                </span>
              ) : (
                <span className="font-display text-4xl text-muted-foreground">
                  —
                </span>
              )}
            </div>
            <div className="mt-1 font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
              {Math.round(avgScore)}/100
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">Crawled</div>
            <div className="mt-2 font-display text-4xl font-bold text-foreground">
              {crawledLocations.length}
              <span className="text-lg text-muted-foreground">
                /{locations.length}
              </span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">locations</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">Check Results</div>
            <div className="mt-2 flex items-end gap-3">
              <div className="text-center">
                <div
                  className="font-[family-name:var(--font-geist-mono)] text-sm font-semibold"
                  style={{ color: "#22c55e" }}
                >
                  {passCount}
                </div>
                <div className="text-[10px] text-muted-foreground">Pass</div>
              </div>
              <div className="text-center">
                <div
                  className="font-[family-name:var(--font-geist-mono)] text-sm font-semibold"
                  style={{ color: "#f59e0b" }}
                >
                  {warnCount}
                </div>
                <div className="text-[10px] text-muted-foreground">Warn</div>
              </div>
              <div className="text-center">
                <div
                  className="font-[family-name:var(--font-geist-mono)] text-sm font-semibold"
                  style={{ color: "#ef4444" }}
                >
                  {failCount}
                </div>
                <div className="text-[10px] text-muted-foreground">Fail</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start justify-between rounded-lg border border-border bg-card p-5">
            <div>
              {lastCrawlDate && (
                <div className="text-xs text-muted-foreground">
                  Last crawl: {lastCrawlDate}
                </div>
              )}
            </div>
            <SeoRunAllButton locationIds={crawlableLocationIds} />
          </div>
        </div>
      </div>

      {/* 02 // LOCATION SCORES */}
      <div>
        <div className="mb-4 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-muted-foreground">
          02 // Location Scores
        </div>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Grade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Key Checks
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Response
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Last Crawled
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {locationsWithSeo.map(({ location, snapshot, checks }) => (
                <tr
                  key={location.id}
                  className="border-b border-border transition-colors hover:bg-muted"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-foreground">
                      {location.name}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {location.city}, {location.state}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {snapshot ? (
                      <GradePill grade={snapshot.letterGrade} size="sm" />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {snapshot ? (
                      <span className="font-[family-name:var(--font-geist-mono)] text-sm text-foreground">
                        {snapshot.overallScore}
                        <span className="text-muted-foreground">/100</span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {checks.length > 0 ? (
                      <SeoStatusIcons checks={checks} />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
                    {snapshot ? `${snapshot.responseTimeMs}ms` : "—"}
                  </td>
                  <td className="px-4 py-3 font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
                    {snapshot
                      ? new Date(snapshot.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {location.currentUrl && (
                        <SeoRunButton
                          locationId={location.id}
                          size="sm"
                          label="Crawl"
                        />
                      )}
                      {snapshot && (
                        <Link
                          href={`/seo/${location.id}`}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 03 // COMPARISON */}
      <div>
        <div className="mb-4 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-muted-foreground">
          03 // Comparison
        </div>
        <SeoComparisonChart
          locations={locations}
          snapshots={latestSnapshots}
        />
      </div>
    </div>
  );
}
