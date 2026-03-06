"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  GitBranch,
  BarChart3,
  Users,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard, shortcut: "G O" },
  { href: "/locations", label: "Locations", icon: MapPin, shortcut: "G L" },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch, shortcut: "G P" },
  { href: "/metrics", label: "Metrics", icon: BarChart3, shortcut: "G M" },
  { href: "/contacts", label: "Contacts", icon: Users, shortcut: "G C" },
];

const BOTTOM_ITEMS = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-background transition-all duration-250",
        sidebarCollapsed ? "w-16" : "w-56"
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-4">
        {!sidebarCollapsed && (
          <span className="font-semibold tracking-tight text-lg text-foreground">
            Embark OS
          </span>
        )}
        {sidebarCollapsed && (
          <span className="mx-auto text-lg font-semibold text-primary">
            E
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-120",
              isActive(item.href)
                ? "bg-muted text-foreground before:absolute before:left-0 before:top-1/2 before:h-5 before:-translate-y-1/2 before:w-[3px] before:rounded-r before:bg-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && (
              <>
                <span>{item.label}</span>
                <span className="ml-auto text-[11px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {item.shortcut}
                </span>
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border px-2 py-3">
        {BOTTOM_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-120",
              isActive(item.href)
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
        <button
          onClick={toggleSidebar}
          className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors duration-120 hover:bg-muted hover:text-muted-foreground"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
