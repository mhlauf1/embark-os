import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { PortfolioOverview } from "@/components/overview/PortfolioOverview";
import { StatsGrid } from "@/components/overview/StatsGrid";
import { ExportButton } from "@/components/overview/ExportButton";
import { getLocationGroup } from "@/lib/groupLocations";
import { computeOverallScore, getLetterGrade } from "@/lib/grading";
import { computeMarketPosition } from "@/lib/market-position";
import type { SeoCheckResult } from "@/types";

async function getStats() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
    include: {
      competitors: true,
      seoSnapshots: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const total = locations.length;
  const uniqueStates = new Set(locations.map((l) => l.state)).size;

  // Group counts for the segment bar
  const liveCount = locations.filter((l) => getLocationGroup(l) === "live").length;
  const inProgressCount = locations.filter((l) => getLocationGroup(l) === "in-progress").length;
  const notStartedCount = locations.filter((l) => getLocationGroup(l) === "not-started").length;

  // Reputation
  const ratedLocations = locations.filter((l) => l.googleRating !== null);
  const ratedCount = ratedLocations.length;
  const totalReviews = ratedLocations.reduce((sum, l) => sum + (l.googleReviewCount ?? 0), 0);
  const avgRating = ratedCount > 0
    ? ratedLocations.reduce((sum, l) => sum + l.googleRating!, 0) / ratedCount
    : null;

  // Web Performance
  const auditedLocations = locations.filter(
    (l) =>
      l.lighthousePerf !== null &&
      l.lighthouseA11y !== null &&
      l.lighthouseSEO !== null &&
      l.lighthouseBP !== null
  );
  const auditedCount = auditedLocations.length;
  let avgLighthouse: number | null = null;
  let lighthouseGrade: string | null = null;
  if (auditedCount > 0) {
    const scores = auditedLocations.map((l) =>
      computeOverallScore(l.lighthousePerf!, l.lighthouseA11y!, l.lighthouseSEO!, l.lighthouseBP!)
    );
    avgLighthouse = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    lighthouseGrade = getLetterGrade(avgLighthouse);
  }

  // SEO Health
  const locationsWithSeo = locations.filter((l) => l.seoSnapshots.length > 0);
  const seoCrawledCount = locationsWithSeo.length;
  let avgSeoScore: number | null = null;
  let seoGrade: string | null = null;
  let totalSeoIssues = 0;
  if (seoCrawledCount > 0) {
    const seoScores = locationsWithSeo.map((l) => l.seoSnapshots[0].overallScore);
    avgSeoScore = Math.round(seoScores.reduce((a, b) => a + b, 0) / seoScores.length);
    seoGrade = getLetterGrade(avgSeoScore);
    for (const loc of locationsWithSeo) {
      try {
        const checks: SeoCheckResult[] = JSON.parse(loc.seoSnapshots[0].checkResults);
        totalSeoIssues += checks.filter((c) => c.status === "fail").length;
      } catch {
        // skip malformed JSON
      }
    }
  }

  // Market Edge
  const locationsWithCompetitors = locations.filter((l) => l.competitors.length > 0);
  let avgMarketScore: number | null = null;
  let marketGrade: string | null = null;
  let avgRatingDelta: number | null = null;
  let totalCompetitors = locations.reduce((sum, l) => sum + l.competitors.length, 0);
  if (locationsWithCompetitors.length > 0) {
    const positions = locationsWithCompetitors.map((l) =>
      computeMarketPosition(l, l.competitors)
    );
    avgMarketScore = Math.round(
      positions.reduce((sum, p) => sum + p.compositeScore, 0) / positions.length
    );
    marketGrade = getLetterGrade(avgMarketScore);
    const deltas = positions.map((p) => p.ratingDelta).filter((d): d is number => d !== null);
    avgRatingDelta = deltas.length > 0
      ? Math.round((deltas.reduce((a, b) => a + b, 0) / deltas.length) * 10) / 10
      : null;
  }

  return {
    locations,
    total,
    uniqueStates,
    liveCount,
    inProgressCount,
    notStartedCount,
    avgRating,
    totalReviews,
    ratedCount,
    avgLighthouse,
    lighthouseGrade,
    auditedCount,
    avgSeoScore,
    seoGrade,
    totalSeoIssues,
    seoCrawledCount,
    avgMarketScore,
    marketGrade,
    avgRatingDelta,
    totalCompetitors,
  };
}

export default async function OverviewPage() {
  const stats = await getStats();

  return (
    <>
      <Topbar title="Portfolio Overview" description="Embark Pet Services">
        <ExportButton />
      </Topbar>
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-border bg-background px-4 py-4 sm:px-6">
          <StatsGrid
            total={stats.total}
            uniqueStates={stats.uniqueStates}
            liveCount={stats.liveCount}
            inProgressCount={stats.inProgressCount}
            notStartedCount={stats.notStartedCount}
            avgLighthouse={stats.avgLighthouse}
            lighthouseGrade={stats.lighthouseGrade}
            auditedCount={stats.auditedCount}
            avgRating={stats.avgRating}
            totalReviews={stats.totalReviews}
            ratedCount={stats.ratedCount}
            avgSeoScore={stats.avgSeoScore}
            seoGrade={stats.seoGrade}
            totalSeoIssues={stats.totalSeoIssues}
            seoCrawledCount={stats.seoCrawledCount}
            avgMarketScore={stats.avgMarketScore}
            marketGrade={stats.marketGrade}
            avgRatingDelta={stats.avgRatingDelta}
            totalCompetitors={stats.totalCompetitors}
          />
        </div>

        <div className="p-4 sm:p-6">
          <PortfolioOverview locations={stats.locations} />
        </div>
      </div>
    </>
  );
}
