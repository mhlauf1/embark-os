import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { SeoDashboard } from "@/components/seo/SeoDashboard";

export default async function SeoPage() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  const latestSnapshots = await prisma.seoSnapshot.findMany({
    orderBy: { createdAt: "desc" },
    distinct: ["locationId"],
  });

  return (
    <>
      <Topbar title="SEO Health" description="On-page SEO crawler & scorecard" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <SeoDashboard
          locations={locations}
          latestSnapshots={latestSnapshots}
        />
      </div>
    </>
  );
}
