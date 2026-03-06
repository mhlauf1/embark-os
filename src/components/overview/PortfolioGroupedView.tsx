"use client";

import { motion } from "framer-motion";
import type { Location } from "@/types";
import { LocationCard } from "@/components/locations/LocationCard";
import { groupLocations, GROUP_META, type LocationGroup } from "@/lib/groupLocations";
import { Badge } from "@/components/ui/badge";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const GROUP_ORDER: LocationGroup[] = ["live", "in-progress", "not-started"];

interface PortfolioGroupedViewProps {
  locations: Location[];
}

export function PortfolioGroupedView({ locations }: PortfolioGroupedViewProps) {
  const groups = groupLocations(locations);

  return (
    <div className="space-y-8">
      {GROUP_ORDER.map((groupKey) => {
        const meta = GROUP_META[groupKey];
        const items = groups[groupKey];

        return (
          <section key={groupKey} aria-labelledby={`group-${groupKey}`}>
            <div className="mb-4 flex items-center gap-3">
              <h2
                id={`group-${groupKey}`}
                className="flex items-center gap-2 border-l-[3px] pl-3 text-sm font-semibold uppercase tracking-wider text-foreground"
                style={{ borderColor: meta.accent }}
              >
                {meta.label}
              </h2>
              <Badge
                variant="secondary"
                className="rounded-full bg-muted px-2 py-0 text-[11px] text-muted-foreground"
              >
                {items.length}
              </Badge>
            </div>

            {items.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                No locations in this phase
              </p>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              >
                {items.map((location) => (
                  <motion.div key={location.id} variants={item}>
                    <LocationCard location={location} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>
        );
      })}
    </div>
  );
}
