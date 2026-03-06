"use client";

import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { SeoCheckResult } from "@/types";

interface SeoCheckListProps {
  checks: SeoCheckResult[];
  filter?: "all" | "issues";
}

const CATEGORY_LABELS: Record<string, string> = {
  meta: "Meta Tags",
  content: "Content",
  technical: "Technical",
  "structured-data": "Structured Data",
};

const CATEGORY_ORDER = ["meta", "content", "technical", "structured-data"];

const STATUS_ICON = {
  pass: <CheckCircle2 className="h-4 w-4" style={{ color: "#22c55e" }} />,
  warn: <AlertTriangle className="h-4 w-4" style={{ color: "#f59e0b" }} />,
  fail: <XCircle className="h-4 w-4" style={{ color: "#ef4444" }} />,
};

export function SeoCheckList({ checks, filter = "all" }: SeoCheckListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(CATEGORY_ORDER)
  );

  const filtered = filter === "issues"
    ? checks.filter((c) => c.status !== "pass")
    : checks;

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    checks: filtered.filter((c) => c.category === cat),
  })).filter((g) => g.checks.length > 0);

  function toggleCategory(cat: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  if (filtered.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        {filter === "issues" ? "No issues found." : "No check results available."}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {grouped.map((group) => {
        const expanded = expandedCategories.has(group.category);
        const passCount = group.checks.filter((c) => c.status === "pass").length;
        const total = group.checks.length;

        return (
          <div key={group.category} className="rounded-lg border border-border bg-card">
            <button
              onClick={() => toggleCategory(group.category)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-2">
                {expanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium text-foreground">
                  {group.label}
                </span>
              </div>
              <span className="font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
                {passCount}/{total} passed
              </span>
            </button>
            {expanded && (
              <div className="border-t border-border divide-y divide-border/50">
                {group.checks.map((c) => (
                  <div key={c.id} className="flex items-start gap-3 px-4 py-3">
                    <div className="mt-0.5 shrink-0">{STATUS_ICON[c.status]}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {c.name}
                        </span>
                        <span className="shrink-0 font-[family-name:var(--font-geist-mono)] text-[10px] text-muted-foreground">
                          weight: {c.weight}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {c.message}
                      </p>
                      {c.details && (
                        <p className="mt-1 truncate font-[family-name:var(--font-geist-mono)] text-[11px] text-muted-foreground/70">
                          {c.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface SeoStatusIconsProps {
  checks: SeoCheckResult[];
}

export function SeoStatusIcons({ checks }: SeoStatusIconsProps) {
  const keyChecks = ["meta-title", "meta-desc", "h1-tag", "schema-jsonld", "https"];
  const labels: Record<string, string> = {
    "meta-title": "Title",
    "meta-desc": "Desc",
    "h1-tag": "H1",
    "schema-jsonld": "Schema",
    https: "SSL",
  };

  return (
    <div className="flex items-center gap-1.5">
      {keyChecks.map((id) => {
        const c = checks.find((ch) => ch.id === id);
        if (!c) return null;
        const color =
          c.status === "pass"
            ? "#22c55e"
            : c.status === "warn"
            ? "#f59e0b"
            : "#ef4444";
        return (
          <span
            key={id}
            className="inline-flex items-center rounded px-1 py-0.5 font-[family-name:var(--font-geist-mono)] text-[9px] font-medium"
            style={{ color, backgroundColor: `${color}15` }}
            title={`${labels[id]}: ${c.status}`}
          >
            {labels[id]}
          </span>
        );
      })}
    </div>
  );
}
