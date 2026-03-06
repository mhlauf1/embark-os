"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface InlineSelectFieldProps {
  value: string;
  options: Option[];
  onSave: (value: string) => Promise<boolean>;
  className?: string;
}

export function InlineSelectField({
  value,
  options,
  onSave,
  className,
}: InlineSelectFieldProps) {
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
    if (newValue === value) {
      setOpen(false);
      return;
    }
    setSaving(true);
    const ok = await onSave(newValue);
    setSaving(false);
    if (ok) setOpen(false);
  }

  const currentLabel =
    options.find((o) => o.value === value)?.label ?? value;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        disabled={saving}
        className="group flex items-center gap-1 rounded px-1 -mx-1 text-sm text-foreground transition-colors hover:bg-muted"
        aria-label="Change value"
      >
        {currentLabel}
        <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-md border border-border bg-card py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "flex w-full items-center px-3 py-1.5 text-left text-sm transition-colors hover:bg-muted",
                option.value === value
                  ? "font-medium text-primary"
                  : "text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
