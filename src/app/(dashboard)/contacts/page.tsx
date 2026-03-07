import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { SectionDivider } from "@/components/shared/SectionDivider";

export default async function ContactsPage() {
  const [contacts, locations] = await Promise.all([
    prisma.contact.findMany({
      include: { location: { select: { name: true, slug: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.location.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <>
      <Topbar title="Contacts" description="All portfolio contacts" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <SectionDivider title="Contact Directory" />
        <ContactsTable contacts={contacts} locations={locations} />
      </div>
    </>
  );
}
