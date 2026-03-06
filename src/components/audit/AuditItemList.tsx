"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { PSIAuditItem } from "@/lib/pagespeed";

interface AuditItemListProps {
  items: PSIAuditItem[];
  title: string;
  description?: string;
}

export function AuditItemList({ items, title, description }: AuditItemListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">No items found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <AuditItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function AuditItem({ item }: { item: PSIAuditItem }) {
  const [expanded, setExpanded] = useState(false);

  const StatusIcon =
    item.score === null
      ? AlertTriangle
      : item.score >= 0.9
      ? CheckCircle2
      : item.score >= 0.5
      ? AlertTriangle
      : XCircle;

  const statusColor =
    item.score === null
      ? "text-muted-foreground"
      : item.score >= 0.9
      ? "text-success"
      : item.score >= 0.5
      ? "text-warning"
      : "text-destructive";

  const savingsMs = item.details?.overallSavingsMs;

  return (
    <div className="rounded-md border border-border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted"
      >
        <StatusIcon className={`h-4 w-4 shrink-0 ${statusColor}`} />
        <span className="flex-1 text-sm text-foreground">{item.title}</span>
        {savingsMs != null && savingsMs > 0 && (
          <span className="shrink-0 rounded bg-destructive/10 px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-xs text-destructive">
            {savingsMs >= 1000
              ? `${(savingsMs / 1000).toFixed(1)}s`
              : `${Math.round(savingsMs)}ms`}
          </span>
        )}
        {item.displayValue && !savingsMs && (
          <span className="shrink-0 font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
            {item.displayValue}
          </span>
        )}
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        )}
      </button>
      {expanded && (
        <div className="border-t border-border px-3 py-2">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {item.description.replace(/\[.*?\]\(.*?\)/g, (match) => {
              const text = match.match(/\[(.*?)\]/)?.[1] ?? match;
              return text;
            })}
          </p>
        </div>
      )}
    </div>
  );
}
