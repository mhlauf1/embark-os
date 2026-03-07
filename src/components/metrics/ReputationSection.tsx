"use client";

import { Star } from "lucide-react";
import type { Location, RatingSnapshot } from "@/types";
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

interface ReputationSectionProps {
  locations: Location[];
  snapshots: (RatingSnapshot & { locationName: string })[];
}

export function ReputationSection({ locations, snapshots }: ReputationSectionProps) {
  const ratedLocations = locations.filter((l) => l.googleRating !== null);

  // Build trend data grouped by date
  const dateMap = new Map<string, Record<string, number>>();
  for (const snap of snapshots) {
    const dateKey = new Date(snap.recordedAt).toLocaleDateString();
    if (!dateMap.has(dateKey)) dateMap.set(dateKey, {});
    const entry = dateMap.get(dateKey)!;
    entry[snap.locationName] = snap.googleRating;
  }

  const trendData = Array.from(dateMap.entries())
    .map(([date, ratings]) => ({ date, ...ratings }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const locationNames = [...new Set(snapshots.map((s) => s.locationName))];

  const colors = [
    "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
    "var(--chart-4)", "var(--chart-5)", "#7C6B8A", "#C47A6B", "#5BA3A0",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-foreground">Google Ratings</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Reputation data across all locations
        </p>
      </div>

      {/* Ratings Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Rating</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Reviews</th>
            </tr>
          </thead>
          <tbody>
            {ratedLocations
              .sort((a, b) => (b.googleRating ?? 0) - (a.googleRating ?? 0))
              .map((location) => (
                <tr key={location.id} className="border-b border-border transition-colors hover:bg-muted">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-foreground">{location.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {location.city}, {location.state}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      <span className="font-[family-name:var(--font-geist-mono)] text-sm text-foreground">
                        {location.googleRating?.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
                    {location.googleReviewCount?.toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Trend Chart */}
      {trendData.length > 1 && (
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-foreground">Rating Trends</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Google rating history over time
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 5, right: 30, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                domain={[3.5, 5]}
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
              {locationNames.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
