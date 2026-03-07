import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { MetricsView } from "@/components/metrics/MetricsView";
import { ReputationSection } from "@/components/metrics/ReputationSection";
import { SectionDivider } from "@/components/shared/SectionDivider";

export default async function MetricsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  const snapshots = await prisma.ratingSnapshot.findMany({
    include: { location: { select: { name: true } } },
    orderBy: { recordedAt: "asc" },
  });

  const snapshotsWithNames = snapshots.map((s) => ({
    ...s,
    locationName: s.location.name,
  }));

  return (
    <>
      <Topbar title="Metrics" description="Performance & SEO intelligence" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
        <MetricsView locations={locations} />
        <div>
          <SectionDivider number="04" title="Reputation" />
          <ReputationSection locations={locations} snapshots={snapshotsWithNames} />
        </div>
      </div>
    </>
  );
}
