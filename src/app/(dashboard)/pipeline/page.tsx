import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { PipelineView } from "@/components/pipeline/PipelineView";

export default async function PipelinePage() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Topbar title="Pipeline" description="Migration & rebuild tracking" />
      <div className="flex-1 overflow-hidden">
        <PipelineView locations={locations} />
      </div>
    </>
  );
}
