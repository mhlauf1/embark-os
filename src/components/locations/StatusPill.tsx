import { cn } from "@/lib/utils";

type StatusVariant =
  | "live"
  | "complete"
  | "in-progress"
  | "blocked"
  | "queued"
  | "default";

function getVariant(status: string): StatusVariant {
  const s = status.toLowerCase();
  if (s === "live" || s === "complete" || s === "correct") return "live";
  if (
    s === "in-development" ||
    s === "in-design" ||
    s === "in-review" ||
    s === "in-execution" ||
    s === "scoped" ||
    s === "access-gathered" ||
    s === "recon" ||
    s === "stakeholder-outreach"
  )
    return "in-progress";
  if (s === "blocked" || s === "misconfigured" || s === "missing")
    return "blocked";
  if (s === "not-started" || s === "not-scoped" || s === "unknown")
    return "queued";
  return "default";
}

const VARIANT_STYLES: Record<StatusVariant, string> = {
  live: "bg-status-live-bg text-status-live",
  complete: "bg-status-complete-bg text-status-complete",
  "in-progress": "bg-status-progress-bg text-status-progress",
  blocked: "bg-status-blocked-bg text-status-blocked",
  queued: "bg-status-queued-bg text-status-queued",
  default: "bg-muted text-muted-foreground",
};

interface StatusPillProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusPill({ status, label, className }: StatusPillProps) {
  const variant = getVariant(status);
  const displayLabel = label ?? status.replace(/-/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider transition-colors duration-200",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {displayLabel}
    </span>
  );
}
