"use client";

import type { Location } from "@/types";
import { LighthouseScore } from "./LighthouseScore";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  ZAxis,
} from "recharts";

interface MetricsViewProps {
  locations: Location[];
}

function ScoreCell({ score }: { score: number | null }) {
  if (score === null) return <td className="px-4 py-3 text-muted-foreground">—</td>;
  const color =
    score >= 90
      ? "text-success"
      : score >= 50
        ? "text-warning"
        : "text-destructive";
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

const LAUF_SLUGS = new Set(["hound-around", "embark-pet-services", "cadence-private-capital"]);

export function MetricsView({ locations }: MetricsViewProps) {
  const locationsWithScores = locations.filter(
    (l) => l.lighthousePerf !== null || l.lighthouseSEO !== null
  );

  const scatterData = locations
    .filter((l) => l.lighthousePerf !== null && l.lighthouseA11y !== null && l.lighthouseBP !== null && l.lighthouseSEO !== null)
    .map((l) => ({
      name: l.name,
      performance: l.lighthousePerf!,
      quality: Math.round(((l.lighthouseA11y! + l.lighthouseBP! + l.lighthouseSEO!) / 3)),
      isLauf: LAUF_SLUGS.has(l.slug),
    }));

  const avgPerf = scatterData.length > 0
    ? Math.round(scatterData.reduce((sum, d) => sum + d.performance, 0) / scatterData.length)
    : 0;
  const avgQuality = scatterData.length > 0
    ? Math.round(scatterData.reduce((sum, d) => sum + d.quality, 0) / scatterData.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Score Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[700px]">
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

      {/* Scatter Plot — Performance vs Quality */}
      {scatterData.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-foreground">
              Performance vs Quality Score
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Quality = average of Accessibility, Best Practices, and SEO. Dashed lines show portfolio averages.
            </p>
          </div>
          <div className="mb-3 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--chart-2)]" />
              <span className="text-xs text-muted-foreground">Built by Lauf</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--chart-3)]" />
              <span className="text-xs text-muted-foreground">Other</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 10, right: 30, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                type="number"
                dataKey="performance"
                name="Performance"
                domain={[20, 100]}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={{ stroke: "var(--border)" }}
                label={{ value: "Performance", position: "bottom", offset: -2, fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="quality"
                name="Quality"
                domain={[60, 100]}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={{ stroke: "var(--border)" }}
                label={{ value: "Quality Score", angle: -90, position: "insideLeft", offset: 10, fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <ZAxis range={[120, 120]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3", stroke: "var(--muted-foreground)" }}
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const d = payload[0].payload as typeof scatterData[number];
                  return (
                    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
                      <p className="text-xs font-medium text-foreground">{d.name}</p>
                      <p className="text-xs text-muted-foreground">Performance: {d.performance}</p>
                      <p className="text-xs text-muted-foreground">Quality: {d.quality}</p>
                    </div>
                  );
                }}
              />
              <ReferenceLine
                x={avgPerf}
                stroke="var(--muted-foreground)"
                strokeDasharray="6 4"
                strokeOpacity={0.5}
                label={{ value: `Avg: ${avgPerf}`, position: "top", fill: "var(--muted-foreground)", fontSize: 10 }}
              />
              <ReferenceLine
                y={avgQuality}
                stroke="var(--muted-foreground)"
                strokeDasharray="6 4"
                strokeOpacity={0.5}
                label={{ value: `Avg: ${avgQuality}`, position: "right", fill: "var(--muted-foreground)", fontSize: 10 }}
              />
              <Scatter data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.isLauf ? "var(--chart-2)" : "var(--chart-3)"}
                    fillOpacity={entry.isLauf ? 1 : 0.7}
                  />
                ))}
              </Scatter>
            </ScatterChart>
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
