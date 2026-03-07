"use client";

import { useState } from "react";
import Link from "next/link";
import type { Location, SeoSnapshot, SeoCheckResult } from "@/types";
import { SeoScoreCard } from "./SeoScoreCard";
import { SeoCheckList } from "./SeoCheckList";
import { SeoRunButton } from "./SeoRunButton";
import { SeoRecommendations } from "./SeoRecommendations";
import { GradePill } from "@/components/audit/GradePill";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface SeoDetailViewProps {
  location: Location;
  snapshots: SeoSnapshot[];
}

type Tab = "all" | "issues" | "history" | "recommendations";

export function SeoDetailView({ location, snapshots }: SeoDetailViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const latest = snapshots[0] ?? null;
  const checks: SeoCheckResult[] = latest
    ? JSON.parse(latest.checkResults)
    : [];

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "All Checks" },
    { id: "issues", label: "Issues Only" },
    { id: "recommendations", label: "Recommendations" },
    { id: "history", label: "History" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/seo"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              {location.name}
            </h2>
            {location.currentUrl && (
              <a
                href={location.currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {location.currentUrl}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {latest && <GradePill grade={latest.letterGrade} size="lg" />}
          <SeoRunButton locationId={location.id} label="Re-crawl" />
        </div>
      </div>

      {/* Score summary */}
      {latest && (
        <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border bg-card p-6">
          <SeoScoreCard
            score={latest.overallScore}
            grade={latest.letterGrade}
            label="Overall SEO Score"
          />
          <div className="flex flex-1 flex-col gap-2">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="font-[family-name:var(--font-geist-mono)] text-2xl font-bold" style={{ color: "#4A9A6E" }}>
                  {checks.filter((c) => c.status === "pass").length}
                </div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-geist-mono)] text-2xl font-bold" style={{ color: "#CB8A40" }}>
                  {checks.filter((c) => c.status === "warn").length}
                </div>
                <div className="text-xs text-muted-foreground">Warnings</div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-geist-mono)] text-2xl font-bold" style={{ color: "#C45C4A" }}>
                  {checks.filter((c) => c.status === "fail").length}
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>
            <div className="mt-2 font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
              Response time: {latest.responseTimeMs}ms
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-md border border-border bg-muted p-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded px-3 py-1.5 font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "all" && <SeoCheckList checks={checks} filter="all" />}
      {activeTab === "issues" && (
        <SeoCheckList checks={checks} filter="issues" />
      )}
      {activeTab === "recommendations" && (
        <SeoRecommendations location={location} checks={checks} />
      )}
      {activeTab === "history" && (
        <SeoHistory snapshots={snapshots} />
      )}
    </div>
  );
}

function SeoHistory({ snapshots }: { snapshots: SeoSnapshot[] }) {
  if (snapshots.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No crawl history available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Grade
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Score
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Response
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Checks
            </th>
          </tr>
        </thead>
        <tbody>
          {snapshots.map((snap) => {
            const checks: SeoCheckResult[] = JSON.parse(snap.checkResults);
            const pass = checks.filter((c) => c.status === "pass").length;
            const warn = checks.filter((c) => c.status === "warn").length;
            const fail = checks.filter((c) => c.status === "fail").length;

            return (
              <tr
                key={snap.id}
                className="border-b border-border transition-colors hover:bg-muted"
              >
                <td className="px-4 py-3 font-[family-name:var(--font-geist-mono)] text-xs text-foreground">
                  {new Date(snap.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <GradePill grade={snap.letterGrade} size="sm" />
                </td>
                <td className="px-4 py-3 font-[family-name:var(--font-geist-mono)] text-sm text-foreground">
                  {snap.overallScore}/100
                </td>
                <td className="px-4 py-3 font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
                  {snap.responseTimeMs}ms
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-xs">
                    <span style={{ color: "#4A9A6E" }}>{pass}P</span>
                    <span style={{ color: "#CB8A40" }}>{warn}W</span>
                    <span style={{ color: "#C45C4A" }}>{fail}F</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
