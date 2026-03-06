"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import type { LocationWithRelations } from "@/types";
import { CompetitorCard } from "@/components/competitors/CompetitorCard";
import { CompetitorForm } from "@/components/competitors/CompetitorForm";
import { CompetitorComparison } from "@/components/competitors/CompetitorComparison";

interface CompetitorsTabProps {
  location: LocationWithRelations;
}

export function CompetitorsTab({ location }: CompetitorsTabProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingCompetitor = editingId
    ? location.competitors.find((c) => c.id === editingId)
    : undefined;

  async function handleDelete(id: string) {
    await fetch(`/api/competitors/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Local Competitors</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Track competitors in the {location.city} market
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Competitor
        </button>
      </div>

      {/* Competitor Cards */}
      {location.competitors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {location.competitors.map((competitor) => (
            <CompetitorCard
              key={competitor.id}
              competitor={competitor}
              onEdit={() => {
                setEditingId(competitor.id);
                setShowForm(true);
              }}
              onDelete={() => handleDelete(competitor.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No competitors added yet. Add local competitors to compare ratings, services, and Lighthouse scores.
          </p>
        </div>
      )}

      {/* Comparison Table */}
      {location.competitors.length > 0 && (
        <CompetitorComparison
          location={location}
          competitors={location.competitors}
        />
      )}

      {/* Form Dialog */}
      {showForm && (
        <CompetitorForm
          locationId={location.id}
          competitor={editingCompetitor}
          onClose={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}
