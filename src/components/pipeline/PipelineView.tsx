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
      <div className="border-b border-border px-6">
        <TabsList className="bg-transparent p-0">
          <TabsTrigger
            value="migration"
            className="relative rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Migration Pipeline
          </TabsTrigger>
          <TabsTrigger
            value="rebuild"
            className="relative rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Rebuild Pipeline
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="migration" className="mt-0 flex-1 overflow-x-auto p-6">
        <KanbanBoard
          locations={locations}
          columns={MIGRATION_STATUSES.map((s) => ({
            id: s,
            label: MIGRATION_STATUS_LABELS[s],
          }))}
          statusField="migrationStatus"
        />
      </TabsContent>

      <TabsContent value="rebuild" className="mt-0 flex-1 overflow-x-auto p-6">
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
