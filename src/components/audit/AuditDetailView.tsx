"use client";

import { useState } from "react";
import Link from "next/link";
import type { Location, AuditSnapshot } from "@/types";
import type { PSIAuditItem } from "@/lib/pagespeed";
import { LighthouseScore } from "@/components/metrics/LighthouseScore";
import { GradePill } from "./GradePill";
import { AuditRunButton } from "./AuditRunButton";
import { ScoreTrendChart } from "./ScoreTrendChart";
import { AuditItemList } from "./AuditItemList";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface AuditDetailViewProps {
  location: Location;
  snapshots: AuditSnapshot[];
}

type Tab = "scores" | "opportunities" | "diagnostics" | "all";

export function AuditDetailView({
  location,
  snapshots,
}: AuditDetailViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("scores");
  const [strategy, setStrategy] = useState<"desktop" | "mobile">("desktop");

  const latest = snapshots.find((s) => s.strategy === strategy);
  const parsed = latest
    ? (JSON.parse(latest.auditDetails) as {
        opportunities: PSIAuditItem[];
        diagnostics: PSIAuditItem[];
        allAudits: PSIAuditItem[];
      })
    : null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "scores", label: "Scores & History" },
    { key: "opportunities", label: "Opportunities" },
    { key: "diagnostics", label: "Diagnostics" },
    { key: "all", label: "All Audits" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/audit"
            className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Audit Dashboard
          </Link>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {location.name}
          </h2>
          {location.currentUrl && (
            <a
              href={location.currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-flex items-center gap-1 font-[family-name:var(--font-geist-mono)] text-xs text-primary hover:text-primary/80"
            >
              {location.currentUrl}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          {latest && (
            <GradePill grade={latest.letterGrade} size="lg" />
          )}
          <AuditRunButton locationId={location.id} />
        </div>
      </div>

      {/* Score circles */}
      {latest && (
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Current Scores
            </span>
            <div className="flex gap-1 rounded-md border border-border bg-muted p-0.5">
              {(["desktop", "mobile"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStrategy(s)}
                  className={`rounded px-2.5 py-1 font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-wider transition-colors ${
                    strategy === s
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-around">
            <LighthouseScore
              score={latest.scorePerf}
              label="Performance"
              size="lg"
            />
            <LighthouseScore
              score={latest.scoreA11y}
              label="Accessibility"
              size="lg"
            />
            <LighthouseScore
              score={latest.scoreSEO}
              label="SEO"
              size="lg"
            />
            <LighthouseScore
              score={latest.scoreBP}
              label="Best Practices"
              size="lg"
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.key === "opportunities" && parsed && (
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                {parsed.opportunities.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "scores" && (
        <ScoreTrendChart snapshots={snapshots} />
      )}

      {activeTab === "opportunities" && parsed && (
        <AuditItemList
          items={parsed.opportunities}
          title="Optimization Opportunities"
          description="Actions ranked by estimated time savings"
        />
      )}

      {activeTab === "diagnostics" && parsed && (
        <AuditItemList
          items={parsed.diagnostics}
          title="Diagnostics"
          description="Detailed audit findings across all categories"
        />
      )}

      {activeTab === "all" && parsed && (
        <AuditItemList
          items={parsed.allAudits}
          title="All Audit Items"
          description={`${parsed.allAudits.length} total audit items from PageSpeed Insights`}
        />
      )}

      {!latest && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No audit data yet for this location.
          </p>
          <div className="mt-4">
            <AuditRunButton locationId={location.id} label="Run First Audit" />
          </div>
        </div>
      )}
    </div>
  );
}
