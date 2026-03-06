"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export function ExportButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch("/api/reports/portfolio-pdf");
      if (!res.ok) throw new Error("Failed to generate report");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `embark-portfolio-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground disabled:opacity-50"
    >
      <Download className="h-3.5 w-3.5" />
      {loading ? "Generating..." : "Export PDF"}
    </button>
  );
}
