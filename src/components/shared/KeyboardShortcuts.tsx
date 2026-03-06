"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function KeyboardShortcuts() {
  const router = useRouter();
  const gPressed = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if typing in input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "g" && !e.metaKey && !e.ctrlKey) {
        gPressed.current = true;
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          gPressed.current = false;
        }, 500);
        return;
      }

      if (gPressed.current) {
        gPressed.current = false;
        clearTimeout(timeoutRef.current);

        const routes: Record<string, string> = {
          o: "/",
          l: "/locations",
          p: "/pipeline",
          m: "/metrics",
          c: "/contacts",
          s: "/settings",
        };

        const path = routes[e.key];
        if (path) {
          e.preventDefault();
          router.push(path);
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeoutRef.current);
    };
  }, [router]);

  return null;
}
