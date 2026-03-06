"use client";

import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuditRunButtonProps {
  locationId: string;
  strategy?: "both" | "desktop" | "mobile";
  label?: string;
  size?: "sm" | "md";
}

export function AuditRunButton({
  locationId,
  strategy = "both",
  label = "Run Audit",
  size = "md",
}: AuditRunButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRun() {
    setLoading(true);
    try {
      const res = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId, strategy }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(err?.error ?? `Audit failed (${res.status})`);
        return;
      }
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Audit request failed: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  const sizeClasses =
    size === "sm"
      ? "px-2 py-1 text-xs gap-1"
      : "px-3 py-1.5 text-sm gap-1.5";

  return (
    <button
      onClick={handleRun}
      disabled={loading}
      className={`inline-flex items-center rounded-md border border-border bg-card font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50 ${sizeClasses}`}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Play className="h-3.5 w-3.5" />
      )}
      {loading ? "Running..." : label}
    </button>
  );
}

interface RunAllButtonProps {
  locationIds: string[];
}

export function RunAllButton({ locationIds }: RunAllButtonProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const router = useRouter();

  async function handleRunAll() {
    setLoading(true);
    const total = locationIds.length;
    setProgress({ current: 0, total });

    for (let i = 0; i < total; i++) {
      setProgress({ current: i + 1, total });
      try {
        await fetch("/api/audits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locationId: locationIds[i], strategy: "both" }),
        });
      } catch {
        // Continue with remaining locations
      }
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleRunAll}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Auditing {progress.current} of {progress.total}...
        </>
      ) : (
        <>
          <Play className="h-3.5 w-3.5" />
          Run All Audits
        </>
      )}
    </button>
  );
}
