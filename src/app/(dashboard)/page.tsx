import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { PortfolioOverview } from "@/components/overview/PortfolioOverview";

async function getStats() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  const total = locations.length;
  const migrationsComplete = locations.filter(
    (l) => l.migrationStatus === "complete"
  ).length;
  const rebuildsLive = locations.filter(
    (l) => l.rebuildStatus === "live"
  ).length;
  const rebuildsInProgress = locations.filter((l) =>
    ["in-design", "in-development", "in-review", "scoped"].includes(
      l.rebuildStatus
    )
  ).length;

  return { locations, total, migrationsComplete, rebuildsLive, rebuildsInProgress };
}

export default async function OverviewPage() {
  const { locations, total, migrationsComplete, rebuildsLive, rebuildsInProgress } =
    await getStats();

  return (
    <>
      <Topbar title="Portfolio Overview" description="Embark Pet Services" />
      <div className="flex-1 overflow-y-auto">
        {/* Stats Bar */}
        <div className="border-b border-border bg-background px-6 py-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total Locations" value={total} total={total} />
            <StatCard label="Migrations Complete" value={migrationsComplete} total={total} />
            <StatCard label="Rebuilds Live" value={rebuildsLive} total={total} />
            <StatCard label="Rebuilds In Progress" value={rebuildsInProgress} total={total} />
          </div>
        </div>

        {/* Location Cards */}
        <div className="p-6">
          <PortfolioOverview locations={locations} />
        </div>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const pct = total > 0 ? (value / total) * 100 : 0;

  return (
    <div
      className="rounded-lg border border-border bg-card px-4 py-3"
      aria-label={`${label}: ${value} of ${total}`}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">/ {total}</p>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
