"use client";

import { Check, Minus } from "lucide-react";
import type { Location } from "@/types";
import { type ServiceKey, SERVICE_LABELS } from "@/types";

interface ServiceMatrixProps {
  locations: Location[];
}

const SERVICE_KEYS: ServiceKey[] = [
  "serviceBoarding",
  "serviceDaycare",
  "serviceGrooming",
  "serviceTraining",
  "serviceVetCare",
  "serviceGroomingEd",
  "serviceWebcams",
  "serviceMobileGroom",
  "serviceRetail",
];

export function ServiceMatrix({ locations }: ServiceMatrixProps) {
  const serviceCounts = SERVICE_KEYS.map((key) => ({
    key,
    count: locations.filter((l) => l[key]).length,
  }));

  const gapThreshold = 3;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 bg-background px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Location
              </th>
              {SERVICE_KEYS.map((key) => {
                const count = serviceCounts.find((s) => s.key === key)?.count ?? 0;
                const isGap = count < gapThreshold && count > 0;
                return (
                  <th
                    key={key}
                    className={`px-3 py-3 text-center text-xs font-medium ${isGap ? "text-warning" : "text-muted-foreground"}`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span>{SERVICE_LABELS[key]}</span>
                      {isGap && (
                        <span className="text-[10px] font-normal text-warning">Gap</span>
                      )}
                    </div>
                  </th>
                );
              })}
              <th className="px-3 py-3 text-center text-xs font-medium text-muted-foreground">
                Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => {
              const serviceCount = SERVICE_KEYS.filter((key) => location[key]).length;
              return (
                <tr
                  key={location.id}
                  className="border-b border-border transition-colors hover:bg-muted"
                >
                  <td className="sticky left-0 z-10 bg-background px-4 py-3">
                    <div>
                      <span className="font-display text-sm text-foreground">
                        {location.name}
                      </span>
                      <span className="ml-2 font-[family-name:var(--font-geist-mono)] text-[11px] text-muted-foreground">
                        {location.city}, {location.state}
                      </span>
                    </div>
                    <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-muted-foreground">
                      {serviceCount} services
                    </span>
                  </td>
                  {SERVICE_KEYS.map((key) => (
                    <td key={key} className="px-3 py-3 text-center">
                      {location[key] ? (
                        <Check className="mx-auto h-4 w-4 text-success" />
                      ) : (
                        <Minus className="mx-auto h-4 w-4 text-muted-foreground/30" />
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-3 text-center">
                    {location.googleRating ? (
                      <span className="font-[family-name:var(--font-geist-mono)] text-sm text-foreground">
                        {location.googleRating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/50">
              <td className="sticky left-0 z-10 bg-muted/50 px-4 py-3 text-xs font-medium text-muted-foreground">
                Total Coverage
              </td>
              {SERVICE_KEYS.map((key) => {
                const count = serviceCounts.find((s) => s.key === key)?.count ?? 0;
                const isGap = count < gapThreshold && count > 0;
                return (
                  <td
                    key={key}
                    className={`px-3 py-3 text-center font-[family-name:var(--font-geist-mono)] text-sm font-medium ${isGap ? "text-warning" : "text-foreground"}`}
                  >
                    {count}/{locations.length}
                  </td>
                );
              })}
              <td className="px-3 py-3 text-center font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
                {locations.filter((l) => l.googleRating).length > 0
                  ? (
                      locations
                        .filter((l) => l.googleRating)
                        .reduce((sum, l) => sum + l.googleRating!, 0) /
                      locations.filter((l) => l.googleRating).length
                    ).toFixed(1)
                  : "—"}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Gap Analysis */}
      {serviceCounts.some((s) => s.count < gapThreshold && s.count > 0) && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <h3 className="text-sm font-medium text-foreground">Coverage Gaps</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Services offered by fewer than {gapThreshold} locations — potential expansion opportunities.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {serviceCounts
              .filter((s) => s.count < gapThreshold && s.count > 0)
              .map((s) => (
                <span
                  key={s.key}
                  className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs text-warning"
                >
                  {SERVICE_LABELS[s.key]} ({s.count}/{locations.length})
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
