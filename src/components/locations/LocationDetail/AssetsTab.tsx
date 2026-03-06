"use client";

import type { LocationWithRelations } from "@/types";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { InlineToggleField } from "@/components/shared/InlineToggleField";
import { InlineSelectField } from "@/components/shared/InlineSelectField";
import { InlineEditField } from "@/components/shared/InlineEditField";

interface Props {
  location: LocationWithRelations;
  onUpdate: (field: string, value: unknown) => Promise<boolean>;
}

const PHOTOGRAPHY_OPTIONS = [
  { value: "none", label: "None" },
  { value: "partial", label: "Partial" },
  { value: "full", label: "Full" },
];

export function AssetsTab({ location, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Asset Inventory
        </h3>
        <div className="space-y-3">
          <AssetRow
            label="Vector Logo (.svg/.ai)"
            available={location.hasLogoVector}
            onToggle={(v) => onUpdate("hasLogoVector", v)}
          />
          <AssetRow
            label="Raster Logo (.png/.jpg)"
            available={location.hasLogoRaster}
            onToggle={(v) => onUpdate("hasLogoRaster", v)}
          />
          <AssetRow
            label="Brand Colors"
            available={location.hasBrandColors}
            onToggle={(v) => onUpdate("hasBrandColors", v)}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Photography</span>
            <div className="flex items-center gap-2">
              <PhotographyIcon status={location.hasPhotography} />
              <InlineSelectField
                value={location.hasPhotography}
                options={PHOTOGRAPHY_OPTIONS}
                onSave={(v) => onUpdate("hasPhotography", v)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Asset Notes
        </h3>
        <InlineEditField
          value={location.assetNotes ?? ""}
          onSave={(v) => onUpdate("assetNotes", v || null)}
          placeholder="Add asset notes"
          multiline
        />
      </div>
    </div>
  );
}

function AssetRow({
  label,
  available,
  onToggle,
}: {
  label: string;
  available: boolean;
  onToggle: (value: boolean) => Promise<boolean>;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {available ? (
          <CheckCircle2 className="h-4 w-4 text-status-live" />
        ) : (
          <XCircle className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <InlineToggleField value={available} onSave={onToggle} />
    </div>
  );
}

function PhotographyIcon({ status }: { status: string }) {
  if (status === "full") return <CheckCircle2 className="h-4 w-4 text-status-live" />;
  if (status === "partial") return <MinusCircle className="h-4 w-4 text-warning" />;
  return <XCircle className="h-4 w-4 text-muted-foreground" />;
}
