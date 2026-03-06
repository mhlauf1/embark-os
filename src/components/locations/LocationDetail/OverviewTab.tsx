"use client";

import type { LocationWithRelations } from "@/types";
import { Star, CheckCircle2, Circle } from "lucide-react";
import { InlineEditField } from "@/components/shared/InlineEditField";
import { InlineSelectField } from "@/components/shared/InlineSelectField";
import { InlineToggleField } from "@/components/shared/InlineToggleField";
import { FACILITY_TYPES } from "@/lib/constants";

interface Props {
  location: LocationWithRelations;
  onUpdate: (field: string, value: unknown) => Promise<boolean>;
}

const FACILITY_TYPE_OPTIONS = FACILITY_TYPES.map((t) => ({
  value: t,
  label: t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));

const REQUIREMENT_FIELDS = [
  { key: "needsOnlineBooking", label: "Online Booking" },
  { key: "needsWebcamFeed", label: "Webcam Feed" },
  { key: "needsPricingCalculator", label: "Pricing Calculator" },
  { key: "needsStaffPage", label: "Staff Page" },
  { key: "needsServicePages", label: "Service Pages" },
  { key: "needsPhotoGallery", label: "Photo Gallery" },
  { key: "needsContactForm", label: "Contact Form" },
  { key: "needsMapsEmbed", label: "Maps Embed" },
  { key: "needsReviewsWidget", label: "Reviews Widget" },
] as const;

export function OverviewTab({ location, onUpdate }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Key Facts */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Key Facts</h3>
        <dl className="space-y-3">
          <EditableInfoRow label="Facility Type">
            <InlineSelectField
              value={location.facilityType}
              options={FACILITY_TYPE_OPTIONS}
              onSave={(v) => onUpdate("facilityType", v)}
            />
          </EditableInfoRow>
          <InfoRow label="City" value={`${location.city}, ${location.state}`} />
          <EditableInfoRow label="Phone">
            <InlineEditField
              value={location.phone ?? ""}
              onSave={(v) => onUpdate("phone", v || null)}
              placeholder="Add phone"
            />
          </EditableInfoRow>
          <EditableInfoRow label="Address">
            <InlineEditField
              value={location.address ?? ""}
              onSave={(v) => onUpdate("address", v || null)}
              placeholder="Add address"
            />
          </EditableInfoRow>
        </dl>
      </div>

      {/* Google Rating */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Google Business</h3>
        {location.googleRating ? (
          <div className="flex items-center gap-3">
            <span className="text-3xl font-semibold text-foreground">
              {location.googleRating.toFixed(1)}
            </span>
            <div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i <= Math.round(location.googleRating ?? 0)
                        ? "fill-warning text-warning"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {location.googleReviewCount} reviews
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No rating data</p>
        )}
      </div>

      {/* Functional Requirements */}
      <div className="rounded-lg border border-border bg-card p-5 md:col-span-2">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Rebuild Requirements
        </h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {REQUIREMENT_FIELDS.map(({ key, label }) => {
            const needed = location[key] as boolean;
            return (
              <div key={key} className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2">
                  {needed ? (
                    <CheckCircle2 className="h-4 w-4 text-status-live" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={needed ? "text-foreground" : "text-muted-foreground"}>
                    {label}
                  </span>
                </div>
                <InlineToggleField
                  value={needed}
                  onSave={(v) => onUpdate(key, v)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}

function EditableInfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
