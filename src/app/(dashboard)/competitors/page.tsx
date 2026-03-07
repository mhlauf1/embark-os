import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { CompetitorIntelDashboard } from "@/components/competitor-intel/CompetitorIntelDashboard";
import { computeMarketPosition } from "@/lib/market-position";

export default async function CompetitorsPage() {
  const locations = await prisma.location.findMany({
    include: {
      competitors: {
        include: {
          ratingSnapshots: { orderBy: { recordedAt: "desc" }, take: 10 },
        },
      },
      ratingSnapshots: { orderBy: { recordedAt: "desc" }, take: 4 },
      aiVisibilityChecks: { orderBy: { createdAt: "desc" }, take: 20 },
    },
    orderBy: { name: "asc" },
  });

  const marketsWithCompetitors = locations.filter((l) => l.competitors.length > 0);
  const positions = marketsWithCompetitors.map((loc) =>
    computeMarketPosition(loc, loc.competitors)
  );

  const totalCompetitors = locations.reduce((sum, l) => sum + l.competitors.length, 0);
  const marketsTracked = marketsWithCompetitors.length;

  return (
    <>
      <Topbar title="Competitor Intel" description="Market position & competitive analysis" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <CompetitorIntelDashboard
          locations={locations}
          positions={positions}
          totalCompetitors={totalCompetitors}
          marketsTracked={marketsTracked}
        />
      </div>
    </>
  );
}
