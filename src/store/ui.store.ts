"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  overviewViewMode: "grouped" | "list";
  setOverviewViewMode: (mode: "grouped" | "list") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed: boolean) =>
        set({ sidebarCollapsed: collapsed }),
      mobileSidebarOpen: false,
      setMobileSidebarOpen: (open: boolean) =>
        set({ mobileSidebarOpen: open }),
      overviewViewMode: "grouped",
      setOverviewViewMode: (mode: "grouped" | "list") =>
        set({ overviewViewMode: mode }),
    }),
    {
      name: "embark-os-ui",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        overviewViewMode: state.overviewViewMode,
      }),
    }
  )
);
