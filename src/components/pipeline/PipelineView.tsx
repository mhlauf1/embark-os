"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "./KanbanBoard";
import type { Location } from "@/types";
import { MIGRATION_STATUSES, REBUILD_STATUSES, MIGRATION_STATUS_LABELS, REBUILD_STATUS_LABELS } from "@/lib/constants";

interface PipelineViewProps {
  locations: Location[];
}

export function PipelineView({ locations }: PipelineViewProps) {
  const [activeTab, setActiveTab] = useState("migration");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
      <div className="border-b border-border px-4 sm:px-6 py-2">
        <div className="flex items-center rounded-lg border border-border bg-card p-0.5 w-fit">
          <TabsList className="bg-transparent p-0 h-auto">
            <TabsTrigger
              value="migration"
              className="rounded-md px-3 py-1.5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wider text-muted-foreground data-[state=active]:bg-border data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Migration
            </TabsTrigger>
            <TabsTrigger
              value="rebuild"
              className="rounded-md px-3 py-1.5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wider text-muted-foreground data-[state=active]:bg-border data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Rebuild
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <TabsContent value="migration" className="mt-0 flex-1 overflow-x-auto p-4 sm:p-6">
        <KanbanBoard
          locations={locations}
          columns={MIGRATION_STATUSES.map((s) => ({
            id: s,
            label: MIGRATION_STATUS_LABELS[s],
          }))}
          statusField="migrationStatus"
        />
      </TabsContent>

      <TabsContent value="rebuild" className="mt-0 flex-1 overflow-x-auto p-4 sm:p-6">
        <KanbanBoard
          locations={locations}
          columns={REBUILD_STATUSES.map((s) => ({
            id: s,
            label: REBUILD_STATUS_LABELS[s],
          }))}
          statusField="rebuildStatus"
        />
      </TabsContent>
    </Tabs>
  );
}
