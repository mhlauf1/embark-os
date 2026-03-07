"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { type ServiceKey, SERVICE_LABELS } from "@/types";
import type { Competitor } from "@/types";

const SERVICE_KEYS: ServiceKey[] = [
  "serviceBoarding", "serviceDaycare", "serviceGrooming", "serviceTraining",
  "serviceVetCare", "serviceGroomingEd", "serviceWebcams", "serviceMobileGroom", "serviceRetail",
];

interface CompetitorFormProps {
  locationId: string;
  competitor?: Competitor;
  onClose: () => void;
}

export function CompetitorForm({ locationId, competitor, onClose }: CompetitorFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const isEdit = !!competitor;

  const [form, setForm] = useState({
    name: competitor?.name ?? "",
    url: competitor?.url ?? "",
    placeId: competitor?.placeId ?? "",
    googleRating: competitor?.googleRating?.toString() ?? "",
    googleReviewCount: competitor?.googleReviewCount?.toString() ?? "",
    notes: competitor?.notes ?? "",
    serviceBoarding: competitor?.serviceBoarding ?? false,
    serviceDaycare: competitor?.serviceDaycare ?? false,
    serviceGrooming: competitor?.serviceGrooming ?? false,
    serviceTraining: competitor?.serviceTraining ?? false,
    serviceVetCare: competitor?.serviceVetCare ?? false,
    serviceGroomingEd: competitor?.serviceGroomingEd ?? false,
    serviceWebcams: competitor?.serviceWebcams ?? false,
    serviceMobileGroom: competitor?.serviceMobileGroom ?? false,
    serviceRetail: competitor?.serviceRetail ?? false,
    lighthousePerf: competitor?.lighthousePerf?.toString() ?? "",
    lighthouseA11y: competitor?.lighthouseA11y?.toString() ?? "",
    lighthouseSEO: competitor?.lighthouseSEO?.toString() ?? "",
    lighthouseBP: competitor?.lighthouseBP?.toString() ?? "",
    lighthouseMobilePerf: competitor?.lighthouseMobilePerf?.toString() ?? "",
    lighthouseMobileA11y: competitor?.lighthouseMobileA11y?.toString() ?? "",
    lighthouseMobileSEO: competitor?.lighthouseMobileSEO?.toString() ?? "",
    lighthouseMobileBP: competitor?.lighthouseMobileBP?.toString() ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      locationId,
      name: form.name,
      url: form.url || null,
      placeId: form.placeId || null,
      googleRating: form.googleRating ? parseFloat(form.googleRating) : null,
      googleReviewCount: form.googleReviewCount ? parseInt(form.googleReviewCount) : null,
      notes: form.notes || null,
      ...Object.fromEntries(SERVICE_KEYS.map((k) => [k, form[k]])),
      lighthousePerf: form.lighthousePerf ? parseInt(form.lighthousePerf) : null,
      lighthouseA11y: form.lighthouseA11y ? parseInt(form.lighthouseA11y) : null,
      lighthouseSEO: form.lighthouseSEO ? parseInt(form.lighthouseSEO) : null,
      lighthouseBP: form.lighthouseBP ? parseInt(form.lighthouseBP) : null,
      lighthouseMobilePerf: form.lighthouseMobilePerf ? parseInt(form.lighthouseMobilePerf) : null,
      lighthouseMobileA11y: form.lighthouseMobileA11y ? parseInt(form.lighthouseMobileA11y) : null,
      lighthouseMobileSEO: form.lighthouseMobileSEO ? parseInt(form.lighthouseMobileSEO) : null,
      lighthouseMobileBP: form.lighthouseMobileBP ? parseInt(form.lighthouseMobileBP) : null,
    };

    const url = isEdit ? `/api/competitors/${competitor.id}` : "/api/competitors";
    const method = isEdit ? "PATCH" : "POST";

    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-background p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-foreground">
            {isEdit ? "Edit Competitor" : "Add Competitor"}
          </h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">URL</label>
              <input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Google Rating</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={form.googleRating}
                onChange={(e) => setForm({ ...form, googleRating: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Review Count</label>
              <input
                type="number"
                min="0"
                value={form.googleReviewCount}
                onChange={(e) => setForm({ ...form, googleReviewCount: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">Google Place ID</label>
              <input
                value={form.placeId}
                onChange={(e) => setForm({ ...form, placeId: e.target.value })}
                placeholder="e.g. ChIJ..."
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <p className="mt-0.5 text-[10px] text-muted-foreground">For automated rating collection via Google Places API</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="mb-2 block text-xs text-muted-foreground">Services</label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm({ ...form, [key]: !form[key] })}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    form[key]
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "bg-muted text-muted-foreground border border-transparent"
                  }`}
                >
                  {SERVICE_LABELS[key]}
                </button>
              ))}
            </div>
          </div>

          {/* Lighthouse Scores */}
          <div>
            <label className="mb-2 block text-xs text-muted-foreground">Lighthouse Scores (Desktop)</label>
            <div className="grid grid-cols-4 gap-2">
              {(["lighthousePerf", "lighthouseA11y", "lighthouseSEO", "lighthouseBP"] as const).map((key) => (
                <div key={key}>
                  <label className="mb-0.5 block text-[10px] text-muted-foreground">
                    {key.replace("lighthouse", "")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs text-muted-foreground">Lighthouse Scores (Mobile)</label>
            <div className="grid grid-cols-4 gap-2">
              {(["lighthouseMobilePerf", "lighthouseMobileA11y", "lighthouseMobileSEO", "lighthouseMobileBP"] as const).map((key) => (
                <div key={key}>
                  <label className="mb-0.5 block text-[10px] text-muted-foreground">
                    {key.replace("lighthouseMobile", "")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : isEdit ? "Update" : "Add Competitor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
