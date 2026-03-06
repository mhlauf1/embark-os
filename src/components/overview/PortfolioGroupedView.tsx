"use client";

import { motion } from "framer-motion";
import type { Location } from "@/types";
import { LocationCard } from "@/components/locations/LocationCard";
import { groupLocations, GROUP_META, type LocationGroup } from "@/lib/groupLocations";

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
    <div className="space-y-10">
      {GROUP_ORDER.map((groupKey, index) => {
        const meta = GROUP_META[groupKey];
        const items = groups[groupKey];
        const sectionIndex = String(index + 1).padStart(2, "0");

        return (
          <section key={groupKey} aria-labelledby={`group-${groupKey}`}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center gap-2.5 shrink-0">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: meta.accent }}
                />
                <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-muted-foreground">
                  {sectionIndex} // {meta.label}
                </span>
              </div>
              <div className="h-px flex-1 bg-border" />
              <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-muted-foreground shrink-0">
                {items.length}
              </span>
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
