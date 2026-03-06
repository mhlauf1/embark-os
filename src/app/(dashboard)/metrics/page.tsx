import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { MetricsView } from "@/components/metrics/MetricsView";

export default async function MetricsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Topbar title="Metrics" description="Performance & SEO intelligence" />
      <div className="flex-1 overflow-y-auto p-6">
        <MetricsView locations={locations} />
      </div>
    </>
  );
}
