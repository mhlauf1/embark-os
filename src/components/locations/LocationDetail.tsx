"use client";

import { ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusPill } from "./StatusPill";
import type { LocationWithRelations, ServiceKey } from "@/types";
import { SERVICE_LABELS } from "@/types";
import { PLATFORM_LABELS, MIGRATION_STATUS_LABELS, REBUILD_STATUS_LABELS, MIGRATION_STATUSES, REBUILD_STATUSES } from "@/lib/constants";
import { OverviewTab } from "./LocationDetail/OverviewTab";
import { SiteTab } from "./LocationDetail/SiteTab";
import { InfraTab } from "./LocationDetail/InfraTab";
import { MigrationTab } from "./LocationDetail/MigrationTab";
import { ContactsTab } from "./LocationDetail/ContactsTab";
import { AssetsTab } from "./LocationDetail/AssetsTab";
import { NotesTab } from "./LocationDetail/NotesTab";
import { useLocationUpdate } from "@/hooks/useLocationUpdate";

const SERVICE_KEYS: ServiceKey[] = [
  "serviceBoarding", "serviceDaycare", "serviceGrooming", "serviceTraining",
  "serviceVetCare", "serviceGroomingEd", "serviceWebcams", "serviceMobileGroom", "serviceRetail",
];

const migrationOptions = MIGRATION_STATUSES.map((s) => ({
  value: s,
  label: MIGRATION_STATUS_LABELS[s],
}));

const rebuildOptions = REBUILD_STATUSES.map((s) => ({
  value: s,
  label: REBUILD_STATUS_LABELS[s],
}));

interface LocationDetailProps {
  location: LocationWithRelations;
}

export function LocationDetail({ location }: LocationDetailProps) {
  const activeServices = SERVICE_KEYS.filter((key) => location[key]);
  const { updateField } = useLocationUpdate(location.id);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill
              status={location.migrationStatus}
              label={MIGRATION_STATUS_LABELS[location.migrationStatus]}
              options={migrationOptions}
              onSave={(v) => updateField("migrationStatus", v)}
            />
            <StatusPill
              status={location.rebuildStatus}
              label={REBUILD_STATUS_LABELS[location.rebuildStatus]}
              options={rebuildOptions}
              onSave={(v) => updateField("rebuildStatus", v)}
            />
            {location.currentPlatform && (
              <span className="rounded bg-muted px-2 py-0.5 font-[family-name:var(--font-geist-mono)] text-[11px] text-muted-foreground">
                {PLATFORM_LABELS[location.currentPlatform] ?? location.currentPlatform}
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {activeServices.map((key) => (
              <span key={key} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {SERVICE_LABELS[key]}
              </span>
            ))}
          </div>
        </div>
        {location.currentUrl && (
          <a
            href={location.currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          >
            Visit Site <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b border-border bg-transparent p-0">
          {["Overview", "Site", "Infrastructure", "Migration", "Contacts", "Assets", "Notes"].map(
            (tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="relative rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm text-muted-foreground transition-colors data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {tab}
              </TabsTrigger>
            )
          )}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview"><OverviewTab location={location} onUpdate={updateField} /></TabsContent>
          <TabsContent value="site"><SiteTab location={location} onUpdate={updateField} /></TabsContent>
          <TabsContent value="infrastructure"><InfraTab location={location} onUpdate={updateField} /></TabsContent>
          <TabsContent value="migration"><MigrationTab location={location} onUpdate={updateField} /></TabsContent>
          <TabsContent value="contacts"><ContactsTab location={location} /></TabsContent>
          <TabsContent value="assets"><AssetsTab location={location} onUpdate={updateField} /></TabsContent>
          <TabsContent value="notes"><NotesTab location={location} /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
