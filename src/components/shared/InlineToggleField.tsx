"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface InlineToggleFieldProps {
  value: boolean;
  onSave: (value: boolean) => Promise<boolean>;
  className?: string;
}

export function InlineToggleField({
  value,
  onSave,
  className,
}: InlineToggleFieldProps) {
  const [saving, setSaving] = useState(false);

  async function handleToggle() {
    setSaving(true);
    await onSave(!value);
    setSaving(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={saving}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
        value ? "bg-primary" : "bg-border",
        saving && "opacity-50",
        className
      )}
      role="switch"
      aria-checked={value}
    >
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
          value ? "translate-x-[18px]" : "translate-x-[2px]"
        )}
      />
    </button>
  );
}
