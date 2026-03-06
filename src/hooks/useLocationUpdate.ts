"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export function useLocationUpdate(locationId: string) {
  const router = useRouter();

  const updateField = useCallback(
    async (field: string, value: unknown) => {
      try {
        const res = await fetch(`/api/locations/${locationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: value }),
        });

        if (!res.ok) throw new Error("Failed to save");

        toast.success("Saved", {
          description: `Updated ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          duration: 2000,
        });

        router.refresh();
        return true;
      } catch {
        toast.error("Failed to save", {
          description: "Please try again",
          duration: 3000,
        });
        return false;
      }
    },
    [locationId, router]
  );

  return { updateField };
}
