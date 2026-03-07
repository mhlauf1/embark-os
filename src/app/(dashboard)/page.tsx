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
  const laufBuiltCount = locations.filter((l) => getLocationGroup(l) === "lauf-built").length;
  const inDevCount = locations.filter((l) => getLocationGroup(l) === "in-development").length;
  const onboardingCount = locations.filter((l) => getLocationGroup(l) === "onboarding").length;
  const notEngagedCount = locations.filter((l) => getLocationGroup(l) === "not-engaged").length;

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
    laufBuiltCount,
    inDevCount,
    onboardingCount,
    notEngagedCount,
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

  const statsProps = {
    total: stats.total,
    uniqueStates: stats.uniqueStates,
    laufBuiltCount: stats.laufBuiltCount,
    inDevCount: stats.inDevCount,
    onboardingCount: stats.onboardingCount,
    notEngagedCount: stats.notEngagedCount,
    avgLighthouse: stats.avgLighthouse,
    lighthouseGrade: stats.lighthouseGrade,
    auditedCount: stats.auditedCount,
    avgRating: stats.avgRating,
    totalReviews: stats.totalReviews,
    ratedCount: stats.ratedCount,
    avgSeoScore: stats.avgSeoScore,
    seoGrade: stats.seoGrade,
    totalSeoIssues: stats.totalSeoIssues,
    seoCrawledCount: stats.seoCrawledCount,
    avgMarketScore: stats.avgMarketScore,
    marketGrade: stats.marketGrade,
    avgRatingDelta: stats.avgRatingDelta,
    totalCompetitors: stats.totalCompetitors,
  };

  return (
    <>
      <Topbar title="Portfolio Overview" description="Embark Pet Services">
        <ExportButton />
      </Topbar>
      <div className="flex-1 overflow-y-auto">
        {/* Mobile/tablet: stats above cards */}
        <div className="border-b border-border bg-background px-4 py-4 sm:px-6 lg:hidden">
          <StatsGrid {...statsProps} />
        </div>

        <div className="p-4 sm:p-6 lg:flex lg:gap-6">
          {/* Left: location cards */}
          <div className="min-w-0 flex-1">
            <PortfolioOverview locations={stats.locations} />
          </div>

          {/* Right: sticky stats column (desktop only) */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-0 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
              <StatsGrid {...statsProps} orientation="vertical" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
