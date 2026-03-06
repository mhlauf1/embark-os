"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  LayoutDashboard,
  MapPin,
  GitBranch,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";

interface LocationItem {
  slug: string;
  name: string;
  city: string;
  state: string;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<LocationItem[]>([]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open && locations.length === 0) {
      fetch("/api/locations")
        .then((r) => r.json())
        .then((data) => setLocations(data))
        .catch(() => {});
    }
  }, [open, locations.length]);

  function navigate(path: string) {
    setOpen(false);
    router.push(path);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />
      <div className="absolute left-1/2 top-[20%] w-full max-w-lg -translate-x-1/2">
        <Command className="rounded-xl border border-border bg-card shadow-2xl">
          <Command.Input
            placeholder="Search locations, navigate..."
            className="w-full border-b border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group
              heading="Navigation"
              className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
            >
              {[
                { label: "Overview", path: "/", icon: LayoutDashboard },
                { label: "Locations", path: "/locations", icon: MapPin },
                { label: "Pipeline", path: "/pipeline", icon: GitBranch },
                { label: "Metrics", path: "/metrics", icon: BarChart3 },
                { label: "Contacts", path: "/contacts", icon: Users },
                { label: "Settings", path: "/settings", icon: Settings },
              ].map(({ label, path, icon: Icon }) => (
                <Command.Item
                  key={path}
                  value={label}
                  onSelect={() => navigate(path)}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground aria-selected:bg-muted aria-selected:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Command.Item>
              ))}
            </Command.Group>

            {locations.length > 0 && (
              <Command.Group
                heading="Locations"
                className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                {locations.map((loc) => (
                  <Command.Item
                    key={loc.slug}
                    value={`${loc.name} ${loc.city}`}
                    onSelect={() => navigate(`/locations/${loc.slug}`)}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground aria-selected:bg-muted aria-selected:text-foreground"
                  >
                    <MapPin className="h-4 w-4" />
                    <div>
                      <span>{loc.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {loc.city}, {loc.state}
                      </span>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
