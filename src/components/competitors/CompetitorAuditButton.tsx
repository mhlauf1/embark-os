"use client";

import { useState } from "react";
import { Loader2, ScanSearch } from "lucide-react";

interface CompetitorAuditButtonProps {
  competitorId: string;
  hasUrl: boolean;
  onComplete: () => void;
  size?: "sm" | "md";
}

export function CompetitorAuditButton({
  competitorId,
  hasUrl,
  onComplete,
  size = "sm",
}: CompetitorAuditButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAudit() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/competitors/${competitorId}/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategy: "both" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Audit failed");
      }

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audit failed");
    } finally {
      setLoading(false);
    }
  }

  if (!hasUrl) return null;

  const isSmall = size === "sm";

  return (
    <div>
      <button
        onClick={handleAudit}
        disabled={loading}
        className={`flex items-center gap-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 transition-colors ${
          isSmall ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
        }`}
      >
        {loading ? (
          <Loader2 className={`animate-spin ${isSmall ? "h-3 w-3" : "h-4 w-4"}`} />
        ) : (
          <ScanSearch className={isSmall ? "h-3 w-3" : "h-4 w-4"} />
        )}
        {loading ? "Auditing..." : "Audit"}
      </button>
      {error && (
        <p className="mt-1 text-[10px] text-destructive">{error}</p>
      )}
    </div>
  );
}
