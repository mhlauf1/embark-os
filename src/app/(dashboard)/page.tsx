import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { PortfolioOverview } from "@/components/overview/PortfolioOverview";
import { StatsGrid } from "@/components/overview/StatsGrid";
import { ExportButton } from "@/components/overview/ExportButton";
import { getLocationGroup } from "@/lib/groupLocations";

async function getStats() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  const total = locations.length;
  const uniqueStates = new Set(locations.map((l) => l.state)).size;
  const migrationsComplete = locations.filter(
    (l) => l.migrationStatus === "complete"
  ).length;
  const migrationsInProgress = locations.filter((l) =>
    ["recon", "stakeholder-outreach", "access-gathered", "in-execution"].includes(
      l.migrationStatus
    )
  ).length;
  const rebuildsLive = locations.filter(
    (l) => l.rebuildStatus === "live"
  ).length;
  const rebuildsInProgress = locations.filter((l) =>
    ["in-design", "in-development", "in-review", "scoped"].includes(
      l.rebuildStatus
    )
  ).length;

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

  return {
    locations,
    total,
    uniqueStates,
    migrationsComplete,
    migrationsInProgress,
    rebuildsLive,
    rebuildsInProgress,
    liveCount,
    inProgressCount,
    notStartedCount,
    avgRating,
    totalReviews,
    ratedCount,
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
            migrationsComplete={stats.migrationsComplete}
            migrationsInProgress={stats.migrationsInProgress}
            rebuildsLive={stats.rebuildsLive}
            rebuildsInProgress={stats.rebuildsInProgress}
            liveCount={stats.liveCount}
            inProgressCount={stats.inProgressCount}
            notStartedCount={stats.notStartedCount}
            avgRating={stats.avgRating}
            totalReviews={stats.totalReviews}
            ratedCount={stats.ratedCount}
          />
        </div>

        <div className="p-4 sm:p-6">
          <PortfolioOverview locations={stats.locations} />
        </div>
      </div>
    </>
  );
}
