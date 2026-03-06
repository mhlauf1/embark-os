"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { LighthouseScore } from "@/components/metrics/LighthouseScore";
import { SERVICE_LABELS, type ServiceKey } from "@/types";

interface CardHoverDetailsProps {
  activeServices: ServiceKey[];
  currentUrl: string | null;
  lighthousePerf: number | null;
}

export function CardHoverDetails({
  activeServices,
  currentUrl,
  lighthousePerf,
}: CardHoverDetailsProps) {
  const [hovered, setHovered] = useState(false);

  const hasDetails =
    activeServices.length > 0 || currentUrl || lighthousePerf !== null;

  if (!hasDetails) return null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2.5 border-t border-border pt-3">
              {/* Services */}
              {activeServices.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {activeServices.map((key) => (
                    <span
                      key={key}
                      className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {SERVICE_LABELS[key]}
                    </span>
                  ))}
                </div>
              )}

              {/* URL + Lighthouse */}
              <div className="flex items-center justify-between">
                {currentUrl && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="truncate font-[family-name:var(--font-geist-mono)]">
                      {currentUrl.replace(/^https?:\/\/(www\.)?/, "")}
                    </span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </div>
                )}
                {lighthousePerf !== null && (
                  <LighthouseScore score={lighthousePerf} size="sm" />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
