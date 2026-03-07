"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/CopyButton";
import { CONTACT_ROLES, ROLE_LABELS } from "@/lib/constants";
import { Search, ArrowUpDown, Plus, X } from "lucide-react";
import type { Contact } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ContactWithLocation = Contact & {
  location: { name: string; slug: string };
};

const columns: ColumnDef<ContactWithLocation>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <button className="flex items-center gap-1" onClick={() => column.toggleSorting()}>
        Name <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: ({ row }) => (
      <span className="font-display font-medium text-foreground">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {ROLE_LABELS[row.original.role] ?? row.original.role}
      </span>
    ),
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.company ?? "—"}</span>
    ),
  },
  {
    accessorFn: (row) => row.location.name,
    id: "location",
    header: "Location",
    cell: ({ row }) => (
      <Link
        href={`/locations/${row.original.location.slug}`}
        className="text-sm text-primary hover:underline"
      >
        {row.original.location.name}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.email;
      if (!email) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="flex items-center gap-1">
          <span className="text-sm text-foreground">{email}</span>
          <CopyButton text={email} />
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.phone;
      if (!phone) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="flex items-center gap-1">
          <span className="text-sm text-foreground">{phone}</span>
          <CopyButton text={phone} />
        </div>
      );
    },
  },
];

interface LocationOption {
  id: string;
  name: string;
  slug: string;
}

interface ContactsTableProps {
  contacts: ContactWithLocation[];
  locations?: LocationOption[];
}

export function ContactsTable({ contacts, locations }: ContactsTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    locationId: "",
    name: "",
    role: "operations" as string,
    email: "",
    phone: "",
    company: "",
  });

  async function handleAddContact(e: React.FormEvent) {
    e.preventDefault();
    if (!form.locationId || !form.name.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locationId: form.locationId,
        name: form.name.trim(),
        role: form.role,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        company: form.company.trim() || undefined,
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      toast.success("Contact added");
      setForm({ locationId: "", name: "", role: "operations", email: "", phone: "", company: "" });
      setShowAddForm(false);
      router.refresh();
    } else {
      toast.error("Failed to add contact");
    }
  }

  const table = useReactTable({
    data: contacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const search = filterValue.toLowerCase();
      const c = row.original;
      return (
        c.name.toLowerCase().includes(search) ||
        (c.company?.toLowerCase().includes(search) ?? false) ||
        c.location.name.toLowerCase().includes(search) ||
        (c.role?.toLowerCase().includes(search) ?? false)
      );
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {locations && locations.length > 0 && (
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            variant={showAddForm ? "outline" : "default"}
            className={showAddForm ? "" : "bg-primary text-white hover:bg-primary/90"}
          >
            {showAddForm ? <><X className="mr-1 h-3.5 w-3.5" /> Cancel</> : <><Plus className="mr-1 h-3.5 w-3.5" /> Add Contact</>}
          </Button>
        )}
      </div>

      {showAddForm && locations && (
        <form onSubmit={handleAddContact} className="rounded-lg border border-border bg-card p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Location *</label>
              <select
                value={form.locationId}
                onChange={(e) => setForm({ ...form, locationId: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                required
              >
                <option value="">Select location...</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Name *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
                className="border-border bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Role *</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {CONTACT_ROLES.map((role) => (
                  <option key={role} value={role}>{ROLE_LABELS[role] ?? role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                type="email"
                className="border-border bg-background text-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(555) 555-5555"
                className="border-border bg-background text-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Company</label>
              <Input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Company name"
                className="border-border bg-background text-foreground"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button type="submit" size="sm" disabled={!form.locationId || !form.name.trim() || submitting} className="bg-primary text-white hover:bg-primary/90">
              <Plus className="mr-1 h-3.5 w-3.5" />
              {submitting ? "Adding..." : "Add Contact"}
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table className="min-w-[700px]">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-b border-border hover:bg-transparent">
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-border transition-colors duration-120 hover:bg-muted">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No contacts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
