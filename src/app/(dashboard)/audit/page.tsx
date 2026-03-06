import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { AuditDashboard } from "@/components/audit/AuditDashboard";

export default async function AuditPage() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  const latestSnapshots = await prisma.auditSnapshot.findMany({
    orderBy: { createdAt: "desc" },
    distinct: ["locationId", "strategy"],
  });

  return (
    <>
      <Topbar title="Site Audit" description="SEO & performance grading" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <AuditDashboard
          locations={locations}
          latestSnapshots={latestSnapshots}
        />
      </div>
    </>
  );
}
