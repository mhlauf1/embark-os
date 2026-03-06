"use client";

import type { Location } from "@/types";
import { LighthouseScore } from "./LighthouseScore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MetricsViewProps {
  locations: Location[];
}

function ScoreCell({ score }: { score: number | null }) {
  if (score === null) return <td className="px-4 py-3 text-muted-foreground">—</td>;
  const color =
    score >= 90
      ? "text-[#22c55e]"
      : score >= 50
        ? "text-[#f59e0b]"
        : "text-[#ef4444]";
  const bg =
    score >= 90
      ? "bg-status-live-bg/50"
      : score >= 50
        ? "bg-status-progress-bg/50"
        : "bg-status-blocked-bg/50";
  return (
    <td className={`px-4 py-3 font-[family-name:var(--font-geist-mono)] text-sm ${color} ${bg}`}>
      {score}
    </td>
  );
}

export function MetricsView({ locations }: MetricsViewProps) {
  const locationsWithScores = locations.filter(
    (l) => l.lighthousePerf !== null || l.lighthouseSEO !== null
  );

  const chartData = locations
    .filter((l) => l.lighthousePerf !== null)
    .map((l) => ({
      name: l.name.length > 15 ? l.name.substring(0, 15) + "..." : l.name,
      Performance: l.lighthousePerf,
      Accessibility: l.lighthouseA11y,
      SEO: l.lighthouseSEO,
      "Best Practices": l.lighthouseBP,
    }));

  return (
    <div className="space-y-8">
      {/* Score Table */}
      <div className="rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Performance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Accessibility
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                SEO
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Best Practices
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Last Audited
              </th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr
                key={location.id}
                className="border-b border-border transition-colors hover:bg-muted"
              >
                <td className="px-4 py-3">
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      {location.name}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {location.city}, {location.state}
                    </span>
                  </div>
                </td>
                <ScoreCell score={location.lighthousePerf} />
                <ScoreCell score={location.lighthouseA11y} />
                <ScoreCell score={location.lighthouseSEO} />
                <ScoreCell score={location.lighthouseBP} />
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {location.lighthouseAudited
                    ? new Date(location.lighthouseAudited).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Score Comparison
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }} />
              <Bar dataKey="Performance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Accessibility" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="SEO" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Best Practices" fill="#a1a1aa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Per-location scores */}
      {locationsWithScores.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {locationsWithScores.map((location) => (
            <div
              key={location.id}
              className="rounded-lg border border-border bg-card p-5"
            >
              <h4 className="mb-3 text-sm font-medium text-foreground">
                {location.name}
              </h4>
              <div className="flex justify-around">
                {location.lighthousePerf !== null && (
                  <LighthouseScore score={location.lighthousePerf} size="sm" label="Perf" />
                )}
                {location.lighthouseA11y !== null && (
                  <LighthouseScore score={location.lighthouseA11y} size="sm" label="A11y" />
                )}
                {location.lighthouseSEO !== null && (
                  <LighthouseScore score={location.lighthouseSEO} size="sm" label="SEO" />
                )}
                {location.lighthouseBP !== null && (
                  <LighthouseScore score={location.lighthouseBP} size="sm" label="BP" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
