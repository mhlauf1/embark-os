import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { KeyboardShortcuts } from "@/components/shared/KeyboardShortcuts";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          {children}
        </main>
        <CommandPalette />
        <KeyboardShortcuts />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            },
            classNames: {
              description: "!text-muted-foreground !opacity-100",
            },
          }}
        />
      </div>
    </SessionProvider>
  );
}
