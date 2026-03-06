import type { LocationWithRelations } from "@/types";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";

interface Props {
  location: LocationWithRelations;
}

export function AssetsTab({ location }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Asset Inventory
        </h3>
        <div className="space-y-3">
          <AssetRow label="Vector Logo (.svg/.ai)" available={location.hasLogoVector} />
          <AssetRow label="Raster Logo (.png/.jpg)" available={location.hasLogoRaster} />
          <AssetRow label="Brand Colors" available={location.hasBrandColors} />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Photography</span>
            <span className="flex items-center gap-1.5 text-sm">
              {location.hasPhotography === "full" && (
                <>
                  <CheckCircle2 className="h-4 w-4 text-status-live" />
                  <span className="text-status-live">Full</span>
                </>
              )}
              {location.hasPhotography === "partial" && (
                <>
                  <MinusCircle className="h-4 w-4 text-[#f59e0b]" />
                  <span className="text-[#f59e0b]">Partial</span>
                </>
              )}
              {location.hasPhotography === "none" && (
                <>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">None</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {location.assetNotes && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            Asset Notes
          </h3>
          <p className="text-sm text-foreground">{location.assetNotes}</p>
        </div>
      )}
    </div>
  );
}

function AssetRow({ label, available }: { label: string; available: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      {available ? (
        <CheckCircle2 className="h-4 w-4 text-status-live" />
      ) : (
        <XCircle className="h-4 w-4 text-muted-foreground" />
      )}
    </div>
  );
}
