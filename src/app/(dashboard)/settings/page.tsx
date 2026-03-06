import { Topbar } from "@/components/layout/Topbar";

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" description="Application preferences" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-6">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-1 text-sm font-medium text-foreground">
              Embark OS
            </h3>
            <p className="text-xs text-muted-foreground">
              Internal operations dashboard for the Embark Pet Services portfolio.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Built by Lauf Studio. Version 1.0.0
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-3 text-sm font-medium text-foreground">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2">
              {[
                { keys: ["Cmd", "K"], label: "Open command palette" },
                { keys: ["G", "O"], label: "Go to Overview" },
                { keys: ["G", "L"], label: "Go to Locations" },
                { keys: ["G", "P"], label: "Go to Pipeline" },
                { keys: ["G", "M"], label: "Go to Metrics" },
                { keys: ["G", "C"], label: "Go to Contacts" },
              ].map(({ keys, label }) => (
                <div
                  key={label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <div className="flex gap-1">
                    {keys.map((key) => (
                      <kbd
                        key={key}
                        className="rounded bg-muted px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-[11px] text-muted-foreground"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-3 text-sm font-medium text-foreground">
              Data
            </h3>
            <p className="text-xs text-muted-foreground">
              Database: SQLite (local). All data is stored in{" "}
              <code className="rounded bg-muted px-1 font-[family-name:var(--font-geist-mono)] text-muted-foreground">
                prisma/dev.db
              </code>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
