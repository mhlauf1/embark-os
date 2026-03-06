import type { Location } from "@/types";

export type LocationGroup = "live" | "in-progress" | "not-started";

export const GROUP_META: Record<
  LocationGroup,
  { label: string; accent: string; borderColor: string }
> = {
  live: {
    label: "Live",
    accent: "var(--success)",
    borderColor: "border-l-success",
  },
  "in-progress": {
    label: "In Progress",
    accent: "var(--warning)",
    borderColor: "border-l-warning",
  },
  "not-started": {
    label: "Not Started",
    accent: "var(--muted-foreground)",
    borderColor: "border-l-muted-foreground",
  },
};

export function getLocationGroup(location: Location): LocationGroup {
  if (location.rebuildStatus === "live") return "live";
  if (
    location.migrationStatus === "not-started" &&
    location.rebuildStatus === "not-scoped"
  )
    return "not-started";
  return "in-progress";
}

export function groupLocations(
  locations: Location[]
): Record<LocationGroup, Location[]> {
  const groups: Record<LocationGroup, Location[]> = {
    live: [],
    "in-progress": [],
    "not-started": [],
  };

  for (const location of locations) {
    groups[getLocationGroup(location)].push(location);
  }

  return groups;
}
