import type { LocationWithRelations } from "@/types";
import { Star, CheckCircle2, Circle } from "lucide-react";

interface Props {
  location: LocationWithRelations;
}

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

export function OverviewTab({ location }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Key Facts */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Key Facts</h3>
        <dl className="space-y-3">
          <InfoRow label="Facility Type" value={location.facilityType} />
          <InfoRow label="City" value={`${location.city}, ${location.state}`} />
          {location.phone && <InfoRow label="Phone" value={location.phone} />}
          {location.address && <InfoRow label="Address" value={location.address} />}
          {location.acquiredAt && (
            <InfoRow
              label="Acquired"
              value={new Date(location.acquiredAt).toLocaleDateString()}
            />
          )}
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
                        ? "fill-[#f59e0b] text-[#f59e0b]"
                        : "text-[#27272a]"
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
            const needed = location[key];
            return (
              <div key={key} className="flex items-center gap-2 text-sm">
                {needed ? (
                  <CheckCircle2 className="h-4 w-4 text-status-live" />
                ) : (
                  <Circle className="h-4 w-4 text-[#27272a]" />
                )}
                <span className={needed ? "text-foreground" : "text-muted-foreground"}>
                  {label}
                </span>
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
