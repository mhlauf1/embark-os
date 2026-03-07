import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { LocationDetail } from "@/components/locations/LocationDetail";
import { getLocationGroup, GROUP_META } from "@/lib/groupLocations";

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
      competitors: { orderBy: { name: "asc" } },
      ratingSnapshots: { orderBy: { recordedAt: "desc" } },
      auditSnapshots: { orderBy: { createdAt: "desc" } },
      seoSnapshots: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!location) notFound();

  const tier = getLocationGroup(location);
  const tierMeta = GROUP_META[tier];

  return (
    <>
      <Topbar
        title={location.name}
        description={`${location.city}, ${location.state}`}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: tierMeta.accent }}
          />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {tierMeta.label}
          </span>
        </span>
      </Topbar>
      <div className="flex-1 overflow-y-auto" style={{ borderTop: `3px solid ${tierMeta.accent}` }}>
        <LocationDetail location={location} />
      </div>
    </>
  );
}
