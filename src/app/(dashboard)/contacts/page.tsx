import { prisma } from "@/lib/db";
import { Topbar } from "@/components/layout/Topbar";
import { ContactsTable } from "@/components/contacts/ContactsTable";

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({
    include: { location: { select: { name: true, slug: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Topbar title="Contacts" description="All portfolio contacts" />
      <div className="flex-1 overflow-y-auto p-6">
        <ContactsTable contacts={contacts} />
      </div>
    </>
  );
}
