import type { Location } from "@/types";

export type LocationGroup = "live" | "in-progress" | "not-started";

export const GROUP_META: Record<
  LocationGroup,
  { label: string; accent: string; borderColor: string }
> = {
  live: {
    label: "Live",
    accent: "#22c55e",
    borderColor: "border-l-[#22c55e]",
  },
  "in-progress": {
    label: "In Progress",
    accent: "#f59e0b",
    borderColor: "border-l-[#f59e0b]",
  },
  "not-started": {
    label: "Not Started",
    accent: "#52525b",
    borderColor: "border-l-[#52525b]",
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
