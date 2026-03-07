"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { MarketPosition } from "@/lib/market-position";

interface Props {
  positions: MarketPosition[];
}

export function WebPerformanceGapChart({ positions }: Props) {
  const data = positions
    .filter((p) => p.ourLighthouseAvg !== null || p.compLighthouseAvg !== null)
    .map((p) => ({
      name: p.locationName.length > 15 ? p.locationName.slice(0, 15) + "…" : p.locationName,
      "Embark": p.ourLighthouseAvg,
      "Avg Competitor": p.compLighthouseAvg,
    }));

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">No Lighthouse data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border)" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Embark" fill="#2D7A6B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Avg Competitor" fill="#A89F94" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
