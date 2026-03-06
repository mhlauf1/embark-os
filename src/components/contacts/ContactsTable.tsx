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
import { CopyButton } from "@/components/shared/CopyButton";
import { ROLE_LABELS } from "@/lib/constants";
import { Search, ArrowUpDown } from "lucide-react";
import type { Contact } from "@prisma/client";
import Link from "next/link";

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
      <span className="font-medium text-foreground">{row.original.name}</span>
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

interface ContactsTableProps {
  contacts: ContactWithLocation[];
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

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
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-b border-border hover:bg-transparent">
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="text-xs font-medium text-muted-foreground">
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
