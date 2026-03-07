"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { RatingSnapshot, CompetitorRatingSnapshot } from "@/types";

interface CompetitorWithRatings {
  name: string;
  ratingSnapshots: CompetitorRatingSnapshot[];
}

interface Props {
  locationName: string;
  ratingSnapshots: RatingSnapshot[];
  competitors: CompetitorWithRatings[];
}

const COLORS = ["#a1a1aa", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];

export function RatingTrendChart({ locationName, ratingSnapshots, competitors }: Props) {
  // Build unified timeline
  const allDates = new Set<string>();
  ratingSnapshots.forEach((s) => allDates.add(new Date(s.recordedAt).toISOString().slice(0, 7)));
  competitors.forEach((c) =>
    c.ratingSnapshots.forEach((s) => allDates.add(new Date(s.recordedAt).toISOString().slice(0, 7)))
  );

  const sortedDates = Array.from(allDates).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">No rating history available</p>
      </div>
    );
  }

  const compWithData = competitors.filter((c) => c.ratingSnapshots.length > 0);

  const data = sortedDates.map((month) => {
    const point: Record<string, string | number | undefined> = { month };
    const embarkSnap = ratingSnapshots.find(
      (s) => new Date(s.recordedAt).toISOString().slice(0, 7) === month
    );
    if (embarkSnap) point[locationName] = embarkSnap.googleRating;

    compWithData.forEach((c) => {
      const snap = c.ratingSnapshots.find(
        (s) => new Date(s.recordedAt).toISOString().slice(0, 7) === month
      );
      if (snap) point[c.name] = snap.googleRating;
    });

    return point;
  });

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border)" }}
            />
            <YAxis
              domain={[3, 5]}
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
            <Line
              type="monotone"
              dataKey={locationName}
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
            {compWithData.map((c, i) => (
              <Line
                key={c.name}
                type="monotone"
                dataKey={c.name}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={1.5}
                strokeDasharray="4 2"
                dot={{ r: 2 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
