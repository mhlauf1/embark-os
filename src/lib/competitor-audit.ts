import { prisma } from "@/lib/db";
import { runPageSpeedAudit } from "@/lib/pagespeed";
import { runSeoCrawl } from "@/lib/seo-crawl";
import { computeOverallScore, getLetterGrade } from "@/lib/grading";

export async function runCompetitorAudit(
  competitorId: string,
  strategy: "desktop" | "mobile"
) {
  const competitor = await prisma.competitor.findUnique({
    where: { id: competitorId },
  });

  if (!competitor) throw new Error("Competitor not found");
  if (!competitor.url) throw new Error("Competitor has no URL to audit");

  const url = competitor.url;

  // Run PageSpeed audit
  const psi = await runPageSpeedAudit(url, strategy);
  const overallScore = computeOverallScore(
    psi.scorePerf,
    psi.scoreA11y,
    psi.scoreSEO,
    psi.scoreBP
  );
  const letterGrade = getLetterGrade(overallScore);

  // Run SEO crawl (only once, not per strategy)
  let seoScore: number | undefined;
  let seoGrade: string | undefined;
  let seoChecks: string | undefined;
  let responseTimeMs: number | undefined;

  if (strategy === "desktop") {
    try {
      const seo = await runSeoCrawl(url);
      seoScore = seo.overallScore;
      seoGrade = seo.letterGrade;
      seoChecks = JSON.stringify(seo.checks);
      responseTimeMs = seo.responseTimeMs;
    } catch {
      // SEO crawl is optional - don't fail the whole audit
    }
  }

  // Create snapshot
  const snapshot = await prisma.competitorSnapshot.create({
    data: {
      competitorId,
      strategy,
      url,
      scorePerf: psi.scorePerf,
      scoreA11y: psi.scoreA11y,
      scoreSEO: psi.scoreSEO,
      scoreBP: psi.scoreBP,
      overallScore,
      letterGrade,
      auditDetails: JSON.stringify({
        opportunities: psi.opportunities,
        diagnostics: psi.diagnostics,
        allAudits: psi.allAudits,
        fetchTime: psi.fetchTime,
      }),
      seoScore,
      seoGrade,
      seoChecks,
      responseTimeMs,
    },
  });

  // Update denormalized fields on competitor
  const updateData: Record<string, unknown> = {
    lighthouseAudited: new Date(),
  };

  if (strategy === "desktop") {
    updateData.lighthousePerf = psi.scorePerf;
    updateData.lighthouseA11y = psi.scoreA11y;
    updateData.lighthouseSEO = psi.scoreSEO;
    updateData.lighthouseBP = psi.scoreBP;
    if (seoScore !== undefined) updateData.seoScore = seoScore;
    if (seoGrade !== undefined) updateData.seoGrade = seoGrade;
  } else {
    updateData.lighthouseMobilePerf = psi.scorePerf;
    updateData.lighthouseMobileA11y = psi.scoreA11y;
    updateData.lighthouseMobileSEO = psi.scoreSEO;
    updateData.lighthouseMobileBP = psi.scoreBP;
  }

  await prisma.competitor.update({
    where: { id: competitorId },
    data: updateData,
  });

  return snapshot;
}
