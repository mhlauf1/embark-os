import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { MarketDetailView } from "@/components/competitor-intel/MarketDetailView";
import { computeMarketPosition } from "@/lib/market-position";
import { getLocationGroup, GROUP_META } from "@/lib/groupLocations";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ locationId: string }>;
}) {
  const { locationId } = await params;

  const location = await prisma.location.findUnique({
    where: { id: locationId },
    include: {
      competitors: {
        include: {
          snapshots: { orderBy: { createdAt: "desc" }, take: 5 },
          ratingSnapshots: { orderBy: { recordedAt: "desc" }, take: 12 },
        },
      },
      ratingSnapshots: { orderBy: { recordedAt: "desc" }, take: 12 },
      aiVisibilityChecks: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });

  if (!location) notFound();

  const tier = getLocationGroup(location);
  const tierMeta = GROUP_META[tier];
  const position = computeMarketPosition(location, location.competitors);

  return (
    <>
      <Topbar
        title={`${location.name} Market`}
        description={`${location.city}, ${location.state} — ${location.competitors.length} competitors`}
      >
        <Link
          href={`/locations/${location.slug}`}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          ← Location Detail
        </Link>
      </Topbar>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ borderTop: `3px solid ${tierMeta.accent}` }}>
        <MarketDetailView
          location={location}
          competitors={location.competitors}
          position={position}
          ratingSnapshots={location.ratingSnapshots}
          aiVisibilityChecks={location.aiVisibilityChecks}
        />
      </div>
    </>
  );
}
