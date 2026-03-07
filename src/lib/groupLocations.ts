import type { Location } from "@/types";

export type LocationGroup = "lauf-built" | "in-development" | "onboarding" | "not-engaged";

export const GROUP_ORDER: LocationGroup[] = [
  "lauf-built",
  "in-development",
  "onboarding",
  "not-engaged",
];

export const GROUP_META: Record<
  LocationGroup,
  { label: string; accent: string; borderColor: string }
> = {
  "lauf-built": {
    label: "Lauf Built",
    accent: "#4A9A6E",
    borderColor: "border-l-success",
  },
  "in-development": {
    label: "In Development",
    accent: "#3B82F6",
    borderColor: "border-l-blue-500",
  },
  onboarding: {
    label: "Onboarding",
    accent: "#CB8A40",
    borderColor: "border-l-warning",
  },
  "not-engaged": {
    label: "Not Engaged",
    accent: "#E5DFD7",
    borderColor: "border-l-muted-foreground",
  },
};

export function getLocationGroup(location: Location): LocationGroup {
  // Manual override takes priority
  if (location.engagementTier) {
    return location.engagementTier as LocationGroup;
  }

  // Auto-derive from statuses
  if (location.rebuildStatus === "live") return "lauf-built";
  if (["in-design", "in-development", "in-review"].includes(location.rebuildStatus))
    return "in-development";
  if (
    location.migrationStatus !== "not-started" ||
    location.rebuildStatus !== "not-scoped"
  )
    return "onboarding";
  return "not-engaged";
}

export function groupLocations(
  locations: Location[]
): Record<LocationGroup, Location[]> {
  const groups: Record<LocationGroup, Location[]> = {
    "lauf-built": [],
    "in-development": [],
    onboarding: [],
    "not-engaged": [],
  };

  for (const location of locations) {
    groups[getLocationGroup(location)].push(location);
  }

  return groups;
}
