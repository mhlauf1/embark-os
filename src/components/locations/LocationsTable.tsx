"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import type { Location } from "@/types";
import { StatusPill } from "./StatusPill";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PLATFORM_LABELS,
  MIGRATION_STATUS_LABELS,
  REBUILD_STATUS_LABELS,
} from "@/lib/constants";
import { ArrowUpDown, Search } from "lucide-react";

const columns: ColumnDef<Location>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting()}
      >
        Name <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <span className="font-medium text-foreground">{row.original.name}</span>
        <span className="ml-2 text-xs text-muted-foreground">
          {row.original.city}, {row.original.state}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "currentPlatform",
    header: "Platform",
    cell: ({ row }) => (
      <span className="font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
        {PLATFORM_LABELS[row.original.currentPlatform ?? ""] ??
          row.original.currentPlatform ??
          "—"}
      </span>
    ),
  },
  {
    accessorKey: "migrationStatus",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting()}
      >
        Migration <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: ({ row }) => (
      <StatusPill
        status={row.original.migrationStatus}
        label={
          MIGRATION_STATUS_LABELS[row.original.migrationStatus] ??
          row.original.migrationStatus
        }
      />
    ),
  },
  {
    accessorKey: "rebuildStatus",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting()}
      >
        Rebuild <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: ({ row }) => (
      <StatusPill
        status={row.original.rebuildStatus}
        label={
          REBUILD_STATUS_LABELS[row.original.rebuildStatus] ??
          row.original.rebuildStatus
        }
      />
    ),
  },
  {
    accessorKey: "lighthousePerf",
    header: "Perf",
    cell: ({ row }) => {
      const score = row.original.lighthousePerf;
      if (score === null) return <span className="text-muted-foreground">—</span>;
      const color =
        score >= 90
          ? "text-[#22c55e]"
          : score >= 50
            ? "text-[#f59e0b]"
            : "text-[#ef4444]";
      return <span className={`font-[family-name:var(--font-geist-mono)] text-sm ${color}`}>{score}</span>;
    },
  },
  {
    accessorKey: "lighthouseSEO",
    header: "SEO",
    cell: ({ row }) => {
      const score = row.original.lighthouseSEO;
      if (score === null) return <span className="text-muted-foreground">—</span>;
      const color =
        score >= 90
          ? "text-[#22c55e]"
          : score >= 50
            ? "text-[#f59e0b]"
            : "text-[#ef4444]";
      return <span className={`font-[family-name:var(--font-geist-mono)] text-sm ${color}`}>{score}</span>;
    },
  },
  {
    accessorKey: "googleRating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.original.googleRating;
      if (rating === null) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="text-sm text-foreground">
          {rating.toFixed(1)}
          <span className="ml-1 text-xs text-muted-foreground">
            ({row.original.googleReviewCount})
          </span>
        </span>
      );
    },
  },
];

interface LocationsTableProps {
  locations: Location[];
}

export function LocationsTable({ locations }: LocationsTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: locations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const search = filterValue.toLowerCase();
      const loc = row.original;
      return (
        loc.name.toLowerCase().includes(search) ||
        loc.city.toLowerCase().includes(search) ||
        (loc.currentPlatform?.toLowerCase().includes(search) ?? false)
      );
    },
  });

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search locations..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-medium text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer border-b border-border transition-colors duration-120 hover:bg-muted"
                  onClick={() =>
                    router.push(`/locations/${row.original.slug}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No locations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
