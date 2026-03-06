import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { ServiceMatrix } from "@/components/services/ServiceMatrix";

export default async function ServicesPage() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Topbar title="Services" description="Coverage matrix across all locations" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <ServiceMatrix locations={locations} />
      </div>
    </>
  );
}
