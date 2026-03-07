import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { AuditDetailView } from "@/components/audit/AuditDetailView";
import { getLocationGroup, GROUP_META } from "@/lib/groupLocations";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ locationId: string }>;
}

export default async function AuditDetailPage({ params }: Props) {
  const { locationId } = await params;

  const location = await prisma.location.findUnique({
    where: { id: locationId },
  });

  if (!location) notFound();

  const tier = getLocationGroup(location);
  const tierMeta = GROUP_META[tier];

  const snapshots = await prisma.auditSnapshot.findMany({
    where: { locationId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Topbar
        title="Audit Detail"
        description={location.name}
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ borderTop: `3px solid ${tierMeta.accent}` }}>
        <AuditDetailView location={location} snapshots={snapshots} />
      </div>
    </>
  );
}
