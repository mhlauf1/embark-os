"use client";

import { signOut } from "next-auth/react";
import { LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function Topbar({ title, description, children }: TopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {children}
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {}}
          title="Search (Cmd+K)"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
