"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineEditFieldProps {
  value: string;
  onSave: (value: string) => Promise<boolean>;
  label?: string;
  mono?: boolean;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
}

export function InlineEditField({
  value,
  onSave,
  label,
  mono,
  multiline,
  placeholder,
  className,
}: InlineEditFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  async function handleSave() {
    if (draft === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const ok = await onSave(draft);
    setSaving(false);
    if (ok) {
      setEditing(false);
    }
  }

  function handleCancel() {
    setDraft(value);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  }

  if (editing) {
    const inputClass = cn(
      "w-full rounded-md border border-primary/40 bg-background px-2 py-1 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30",
      mono && "font-[family-name:var(--font-geist-mono)]"
    );

    return (
      <div className={cn("flex items-start gap-1.5", className)}>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(inputClass, "min-h-[60px] resize-y")}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={inputClass}
          />
        )}
        <div className="flex shrink-0 gap-0.5">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded p-1 text-status-live hover:bg-status-live-bg"
            aria-label="Save"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleCancel}
            className="rounded p-1 text-muted-foreground hover:bg-muted"
            aria-label="Cancel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex cursor-pointer items-center gap-1.5 rounded px-1 -mx-1 transition-colors hover:bg-muted",
        className
      )}
      onClick={() => setEditing(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setEditing(true)}
      aria-label={label ? `Edit ${label}` : "Edit"}
    >
      <span
        className={cn(
          "text-sm",
          mono && "font-[family-name:var(--font-geist-mono)]",
          !value && "text-muted-foreground italic"
        )}
      >
        {value || placeholder || "Empty"}
      </span>
      <Pencil className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}
