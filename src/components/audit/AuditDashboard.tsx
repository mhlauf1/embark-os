"use client";

import Link from "next/link";
import type { Location, AuditSnapshot } from "@/types";
import { GradePill } from "./GradePill";
import { AuditRunButton, RunAllButton } from "./AuditRunButton";
import { AuditComparisonChart } from "./AuditComparisonChart";
import { getLetterGrade, computeOverallScore, getGradeColor } from "@/lib/grading";
import { Eye } from "lucide-react";

interface AuditDashboardProps {
  locations: Location[];
  latestSnapshots: AuditSnapshot[];
}

export function AuditDashboard({
  locations,
  latestSnapshots,
}: AuditDashboardProps) {
  // Compute portfolio-level stats
  const locationsWithGrades = locations.map((loc) => {
    const desktop = latestSnapshots.find(
      (s) => s.locationId === loc.id && s.strategy === "desktop"
    );
    const mobile = latestSnapshots.find(
      (s) => s.locationId === loc.id && s.strategy === "mobile"
    );
    return { location: loc, desktop, mobile };
  });

  const auditedLocations = locationsWithGrades.filter(
    (l) => l.desktop || l.mobile
  );

  const avgScore =
    auditedLocations.length > 0
      ? auditedLocations.reduce((sum, l) => {
          const score = l.desktop?.overallScore ?? l.mobile?.overallScore ?? 0;
          return sum + score;
        }, 0) / auditedLocations.length
      : 0;

  const avgGrade = auditedLocations.length > 0 ? getLetterGrade(avgScore) : "—";

  // Grade distribution
  const gradeDistribution: Record<string, number> = {};
  for (const l of auditedLocations) {
    const grade = l.desktop?.letterGrade ?? l.mobile?.letterGrade ?? "F";
    const letter = grade.charAt(0);
    gradeDistribution[letter] = (gradeDistribution[letter] ?? 0) + 1;
  }

  const lastAuditDate = latestSnapshots.length > 0
    ? new Date(
        Math.max(...latestSnapshots.map((s) => new Date(s.createdAt).getTime()))
      ).toLocaleDateString()
    : null;

  const auditableLocationIds = locations
    .filter((l) => l.currentUrl)
    .map((l) => l.id);

  return (
    <div className="space-y-8">
      {/* 01 // PORTFOLIO GRADES */}
      <div>
        <div className="mb-4 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-muted-foreground">
          01 // Portfolio Grades
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
            <div className="text-xs text-muted-foreground">Audited</div>
            <div className="mt-2 font-display text-4xl font-bold text-foreground">
              {auditedLocations.length}
              <span className="text-lg text-muted-foreground">
                /{locations.length}
              </span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">locations</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">
              Grade Distribution
            </div>
            <div className="mt-2 flex items-end gap-2">
              {["A", "B", "C", "D", "F"].map((g) => (
                <div key={g} className="text-center">
                  <div className="font-[family-name:var(--font-geist-mono)] text-sm font-semibold text-foreground">
                    {gradeDistribution[g] ?? 0}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{g}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start justify-between rounded-lg border border-border bg-card p-5">
            <div>
              {lastAuditDate && (
                <div className="text-xs text-muted-foreground">
                  Last audit: {lastAuditDate}
                </div>
              )}
            </div>
            <RunAllButton locationIds={auditableLocationIds} />
          </div>
        </div>
      </div>

      {/* 02 // LOCATION GRADES */}
      <div>
        <div className="mb-4 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-muted-foreground">
          02 // Location Grades
        </div>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Desktop
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Mobile
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Perf
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  A11y
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  SEO
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  BP
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Last Audited
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {locationsWithGrades.map(({ location, desktop, mobile }) => (
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
                    {desktop ? (
                      <GradePill grade={desktop.letterGrade} size="sm" />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {mobile ? (
                      <GradePill grade={mobile.letterGrade} size="sm" />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ScoreCell score={desktop?.scorePerf ?? null} />
                  </td>
                  <td className="px-4 py-3">
                    <ScoreCell score={desktop?.scoreA11y ?? null} />
                  </td>
                  <td className="px-4 py-3">
                    <ScoreCell score={desktop?.scoreSEO ?? null} />
                  </td>
                  <td className="px-4 py-3">
                    <ScoreCell score={desktop?.scoreBP ?? null} />
                  </td>
                  <td className="px-4 py-3 font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
                    {desktop
                      ? new Date(desktop.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {location.currentUrl && (
                        <AuditRunButton
                          locationId={location.id}
                          size="sm"
                          label="Run"
                        />
                      )}
                      {(desktop || mobile) && (
                        <Link
                          href={`/audit/${location.id}`}
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
        <AuditComparisonChart
          locations={locations}
          snapshots={latestSnapshots}
        />
      </div>
    </div>
  );
}

function ScoreCell({ score }: { score: number | null }) {
  if (score === null)
    return <span className="text-xs text-muted-foreground">—</span>;

  const color =
    score >= 90
      ? "text-success"
      : score >= 50
      ? "text-warning"
      : "text-destructive";

  return (
    <span
      className={`font-[family-name:var(--font-geist-mono)] text-sm ${color}`}
    >
      {score}
    </span>
  );
}
