"use client";

import { Check, X } from "lucide-react";
import type { Location, Competitor } from "@/types";
import { type ServiceKey, SERVICE_LABELS } from "@/types";

const SERVICE_KEYS: ServiceKey[] = [
  "serviceBoarding", "serviceDaycare", "serviceGrooming", "serviceTraining",
  "serviceVetCare", "serviceGroomingEd", "serviceWebcams", "serviceMobileGroom", "serviceRetail",
];

interface Props {
  location: Location;
  competitors: Competitor[];
}

export function ServiceOverlapMatrix({ location, competitors }: Props) {
  const entities = [
    { name: location.name, isEmbark: true, data: location },
    ...competitors.map((c) => ({ name: c.name, isEmbark: false, data: c })),
  ];

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Service</th>
              {entities.map((e) => (
                <th
                  key={e.name}
                  className={`px-3 py-3 text-center text-xs font-medium ${
                    e.isEmbark ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {e.name.length > 12 ? e.name.slice(0, 12) + "…" : e.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SERVICE_KEYS.map((key) => {
              const embarkHas = location[key];
              const anyCompHas = competitors.some((c) => c[key]);
              const isGap = !embarkHas && anyCompHas;

              return (
                <tr
                  key={key}
                  className={`border-b border-border last:border-0 ${isGap ? "bg-destructive/5" : ""}`}
                >
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">
                    {SERVICE_LABELS[key]}
                    {isGap && (
                      <span className="ml-1.5 rounded bg-destructive/10 px-1 py-0.5 text-[9px] font-medium text-destructive">
                        GAP
                      </span>
                    )}
                  </td>
                  {entities.map((e) => (
                    <td key={e.name} className="px-3 py-2.5 text-center">
                      {e.data[key] ? (
                        <Check className="mx-auto h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <X className="mx-auto h-3.5 w-3.5 text-muted-foreground/20" />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
