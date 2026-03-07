"use client";

import { useState } from "react";
import type { Location, SeoCheckResult, SeoRecommendation } from "@/types";
import { generateRecommendations, calculatePotentialScore } from "@/lib/seo-recommendations";
import { GradePill } from "@/components/audit/GradePill";
import { getLetterGrade } from "@/lib/grading";
import { ChevronDown, ChevronRight, Copy, Check, ArrowRight } from "lucide-react";

interface SeoRecommendationsProps {
  location: Location;
  checks: SeoCheckResult[];
}

const PRIORITY_CONFIG = {
  critical: { label: "Critical", color: "#C45C4A", bg: "rgba(196,92,74,0.08)" },
  important: { label: "Important", color: "#CB8A40", bg: "rgba(203,138,64,0.08)" },
  minor: { label: "Minor", color: "#A89F94", bg: "rgba(168,159,148,0.08)" },
} as const;

export function SeoRecommendations({ location, checks }: SeoRecommendationsProps) {
  const recommendations = generateRecommendations(location, checks);
  const potential = calculatePotentialScore(checks);
  const currentGrade = getLetterGrade(potential.currentScore);

  if (recommendations.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <div className="font-[family-name:var(--font-geist-mono)] text-2xl font-bold" style={{ color: "#4A9A6E" }}>
          All Checks Passing
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          No recommendations needed — this site scores {potential.currentScore}/100.
        </p>
      </div>
    );
  }

  const groups = {
    critical: recommendations.filter((r) => r.priority === "critical"),
    important: recommendations.filter((r) => r.priority === "important"),
    minor: recommendations.filter((r) => r.priority === "minor"),
  };

  return (
    <div className="space-y-6">
      {/* Score Potential Banner */}
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-[family-name:var(--font-geist-mono)]">
            Score Potential
          </div>
          <p className="mt-1 text-sm text-foreground">
            Fix {recommendations.length} issue{recommendations.length !== 1 ? "s" : ""} to reach{" "}
            <span className="font-semibold">{potential.potentialScore}/100</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-xs text-muted-foreground font-[family-name:var(--font-geist-mono)]">Now</div>
            <GradePill grade={currentGrade} size="md" />
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="text-center">
            <div className="text-xs text-muted-foreground font-[family-name:var(--font-geist-mono)]">Potential</div>
            <GradePill grade={potential.potentialGrade} size="md" />
          </div>
        </div>
      </div>

      {/* Priority Groups */}
      {(["critical", "important", "minor"] as const).map((priority) => {
        const items = groups[priority];
        if (items.length === 0) return null;
        const config = PRIORITY_CONFIG[priority];

        return (
          <PriorityGroup
            key={priority}
            label={config.label}
            color={config.color}
            bg={config.bg}
            items={items}
          />
        );
      })}
    </div>
  );
}

function PriorityGroup({
  label,
  color,
  bg,
  items,
}: {
  label: string;
  color: string;
  bg: string;
  items: SeoRecommendation[];
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <span
            className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold font-[family-name:var(--font-geist-mono)]"
            style={{ color, backgroundColor: bg }}
          >
            {label}
          </span>
          <span className="text-xs text-muted-foreground">
            {items.length} issue{items.length !== 1 ? "s" : ""}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="divide-y divide-border border-t border-border">
          {items.map((rec) => (
            <RecommendationCard key={rec.checkId} rec={rec} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecommendationCard({ rec }: { rec: SeoRecommendation }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
      >
        {open ? (
          <ChevronDown className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
        )}
        <div className="min-w-0">
          <div className="text-sm font-medium text-foreground">{rec.title}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{rec.impact}</div>
        </div>
      </button>

      {open && (
        <div className="space-y-3 px-4 pb-4 pl-11">
          <p className="text-sm text-muted-foreground">{rec.explanation}</p>

          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-[family-name:var(--font-geist-mono)] mb-1">
              Suggested Fix
            </div>
            <p className="text-sm text-foreground">{rec.suggestion}</p>
          </div>

          {rec.currentValue && (
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-[family-name:var(--font-geist-mono)] mb-1">
                Current Value
              </div>
              <p className="text-sm text-muted-foreground break-all">{rec.currentValue}</p>
            </div>
          )}

          {rec.codeSnippet && <CodeBlock code={rec.codeSnippet} />}
        </div>
      )}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-md border border-border bg-muted">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        title="Copy to clipboard"
      >
        {copied ? <Check className="h-3.5 w-3.5" style={{ color: "#4A9A6E" }} /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre className="overflow-x-auto p-3 pr-10 font-[family-name:var(--font-geist-mono)] text-xs text-foreground">
        {code}
      </pre>
    </div>
  );
}
