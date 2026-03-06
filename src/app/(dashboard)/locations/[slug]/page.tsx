import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { LocationDetail } from "@/components/locations/LocationDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LocationDetailPage({ params }: Props) {
  const { slug } = await params;

  const location = await prisma.location.findUnique({
    where: { slug },
    include: {
      contacts: { orderBy: { isPrimary: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!location) notFound();

  return (
    <>
      <Topbar
        title={location.name}
        description={`${location.city}, ${location.state}`}
      />
      <div className="flex-1 overflow-y-auto">
        <LocationDetail location={location} />
      </div>
    </>
  );
}
