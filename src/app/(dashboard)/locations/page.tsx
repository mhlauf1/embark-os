import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { LocationsTable } from "@/components/locations/LocationsTable";

export default async function LocationsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Topbar title="Locations" description="All portfolio locations" />
      <div className="flex-1 overflow-y-auto p-6">
        <LocationsTable locations={locations} />
      </div>
    </>
  );
}
