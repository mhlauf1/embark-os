"use client";

import { useState } from "react";
import type { AuditSnapshot } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ScoreTrendChartProps {
  snapshots: AuditSnapshot[];
}

export function ScoreTrendChart({ snapshots }: ScoreTrendChartProps) {
  const [strategy, setStrategy] = useState<"desktop" | "mobile">("desktop");

  const filtered = snapshots
    .filter((s) => s.strategy === strategy)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const data = filtered.map((s) => ({
    date: new Date(s.createdAt).toLocaleDateString(),
    Performance: s.scorePerf,
    Accessibility: s.scoreA11y,
    SEO: s.scoreSEO,
    "Best Practices": s.scoreBP,
    Overall: Math.round(s.overallScore),
  }));

  if (data.length < 2) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Run more audits to see score trends over time.
      </div>
    );
  }

  const lines = [
    { key: "Performance", color: "#22c55e" },
    { key: "Accessibility", color: "#3b82f6" },
    { key: "SEO", color: "#f59e0b" },
    { key: "Best Practices", color: "#8b5cf6" },
    { key: "Overall", color: "var(--foreground)" },
  ];

  // Compute deltas from first to last
  const first = data[0];
  const last = data[data.length - 1];
  const deltas = lines.map((l) => ({
    label: l.key,
    delta:
      (last[l.key as keyof typeof last] as number) -
      (first[l.key as keyof typeof first] as number),
    color: l.color,
  }));

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Score History</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Category scores over time
          </p>
        </div>
        <div className="flex gap-1 rounded-md border border-border bg-muted p-0.5">
          {(["desktop", "mobile"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStrategy(s)}
              className={`rounded px-2.5 py-1 font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-wider transition-colors ${
                strategy === s
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Delta badges */}
      <div className="mb-4 flex flex-wrap gap-3">
        {deltas.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5 text-xs">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-muted-foreground">{d.label}</span>
            <span
              className="font-[family-name:var(--font-geist-mono)] font-medium"
              style={{
                color: d.delta > 0 ? "#22c55e" : d.delta < 0 ? "#ef4444" : "var(--muted-foreground)",
              }}
            >
              {d.delta > 0 ? "+" : ""}
              {d.delta}
            </span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, bottom: 5, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
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
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {lines.map((l) => (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              stroke={l.color}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
