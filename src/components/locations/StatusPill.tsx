import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

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
  options?: { value: string; label: string }[];
  onSave?: (value: string) => Promise<boolean>;
}

export function StatusPill({ status, label, className, options, onSave }: StatusPillProps) {
  const variant = getVariant(status);
  const displayLabel = label ?? status.replace(/-/g, " ");
  const editable = !!options && !!onSave;

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  async function handleSelect(newValue: string) {
    if (newValue === status || !onSave) {
      setOpen(false);
      return;
    }
    setSaving(true);
    const ok = await onSave(newValue);
    setSaving(false);
    if (ok) setOpen(false);
  }

  const pillContent = (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider transition-colors duration-200",
        VARIANT_STYLES[variant],
        editable && "cursor-pointer hover:ring-1 hover:ring-primary/30",
        saving && "opacity-50",
        className
      )}
    >
      {displayLabel}
      {editable && (
        <ChevronDown className="ml-1 h-2.5 w-2.5" />
      )}
    </span>
  );

  if (!editable) return pillContent;

  return (
    <div ref={ref} className="relative inline-block">
      <button onClick={() => setOpen(!open)} disabled={saving}>
        {pillContent}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-md border border-border bg-card py-1 shadow-lg">
          {options.map((option) => {
            const optionVariant = getVariant(option.value);
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-muted",
                  option.value === status && "font-medium"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-2 w-2 rounded-full",
                    VARIANT_STYLES[optionVariant]
                  )}
                />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
