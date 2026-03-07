"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "./KanbanCard";
import type { Location } from "@/types";

interface Column {
  id: string;
  label: string;
}

interface KanbanBoardProps {
  locations: Location[];
  columns: Column[];
  statusField: "migrationStatus" | "rebuildStatus";
}

export function KanbanBoard({ locations, columns, statusField }: KanbanBoardProps) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  function getLocationsForColumn(columnId: string) {
    return locations.filter((l) => l[statusField] === columnId);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const locationId = active.id as string;
    const overId = over.id as string;

    // Determine the target column
    let targetColumn = overId;
    // If dropped on another card, find that card's column
    const overLocation = locations.find((l) => l.id === overId);
    if (overLocation) {
      targetColumn = overLocation[statusField];
    }

    // If dropped on a column header
    const isColumn = columns.some((c) => c.id === overId);
    if (isColumn) {
      targetColumn = overId;
    }

    const location = locations.find((l) => l.id === locationId);
    if (!location || location[statusField] === targetColumn) return;

    await fetch(`/api/locations/${locationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [statusField]: targetColumn }),
    });

    router.refresh();
  }

  const activeLocation = locations.find((l) => l.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4">
        {columns.map((column) => {
          const columnLocations = getLocationsForColumn(column.id);
          return (
            <div
              key={column.id}
              className="flex w-64 shrink-0 flex-col rounded-lg bg-card p-3"
              id={column.id}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  {column.label}
                </h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {columnLocations.length}
                </span>
              </div>
              <SortableContext
                items={columnLocations.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-1 flex-col gap-2">
                  {columnLocations.map((location) => (
                    <KanbanCard
                      key={location.id}
                      location={location}
                      statusField={statusField}
                    />
                  ))}
                  {columnLocations.length === 0 && (
                    <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-border py-8 text-xs text-muted-foreground">
                      Drop here
                    </div>
                  )}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
      <DragOverlay>
        {activeLocation ? (
          <KanbanCard
            location={activeLocation}
            statusField={statusField}
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
