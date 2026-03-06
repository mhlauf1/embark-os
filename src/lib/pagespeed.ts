export interface PSIAuditItem {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  displayValue?: string;
  numericValue?: number;
  details?: {
    type: string;
    overallSavingsMs?: number;
    items?: unknown[];
  };
}

export interface PSIResult {
  scorePerf: number;
  scoreA11y: number;
  scoreSEO: number;
  scoreBP: number;
  opportunities: PSIAuditItem[];
  diagnostics: PSIAuditItem[];
  allAudits: PSIAuditItem[];
  fetchTime: string;
}

export async function runPageSpeedAudit(
  url: string,
  strategy: "desktop" | "mobile"
): Promise<PSIResult> {
  const apiKey = process.env.PAGESPEED_API_KEY;
  const categories = ["performance", "accessibility", "seo", "best-practices"];
  const params = new URLSearchParams({
    url,
    strategy,
    ...(apiKey ? { key: apiKey } : {}),
  });
  for (const cat of categories) {
    params.append("category", cat);
  }

  const res = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`PageSpeed API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const cats = data.lighthouseResult?.categories ?? {};
  const audits = data.lighthouseResult?.audits ?? {};

  const scorePerf = Math.round((cats.performance?.score ?? 0) * 100);
  const scoreA11y = Math.round((cats.accessibility?.score ?? 0) * 100);
  const scoreSEO = Math.round((cats.seo?.score ?? 0) * 100);
  const scoreBP = Math.round((cats["best-practices"]?.score ?? 0) * 100);

  const allAudits: PSIAuditItem[] = Object.values(audits).map((a: unknown) => {
    const audit = a as Record<string, unknown>;
    return {
      id: audit.id as string,
      title: audit.title as string,
      description: (audit.description as string) ?? "",
      score: audit.score as number | null,
      scoreDisplayMode: (audit.scoreDisplayMode as string) ?? "binary",
      displayValue: audit.displayValue as string | undefined,
      numericValue: audit.numericValue as number | undefined,
      details: audit.details as PSIAuditItem["details"],
    };
  });

  const opportunities = allAudits
    .filter(
      (a) =>
        a.details?.type === "opportunity" &&
        a.details.overallSavingsMs &&
        a.details.overallSavingsMs > 0
    )
    .sort(
      (a, b) =>
        (b.details?.overallSavingsMs ?? 0) - (a.details?.overallSavingsMs ?? 0)
    );

  const diagnostics = allAudits.filter(
    (a) =>
      a.scoreDisplayMode === "binary" ||
      a.scoreDisplayMode === "metricSavings" ||
      (a.score !== null && a.score < 1 && a.scoreDisplayMode !== "informative" && a.scoreDisplayMode !== "notApplicable")
  );

  return {
    scorePerf,
    scoreA11y,
    scoreSEO,
    scoreBP,
    opportunities,
    diagnostics,
    allAudits,
    fetchTime: data.analysisUTCTimestamp ?? new Date().toISOString(),
  };
}
