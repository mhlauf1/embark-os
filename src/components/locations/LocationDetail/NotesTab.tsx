"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LocationWithRelations } from "@/types";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, MessageSquare, Plus } from "lucide-react";

interface Props {
  location: LocationWithRelations;
}

export function NotesTab({ location }: Props) {
  const router = useRouter();
  const [newNote, setNewNote] = useState("");
  const [isBlocker, setIsBlocker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleAddNote() {
    if (!newNote.trim()) return;
    setSubmitting(true);

    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locationId: location.id,
        body: newNote,
        isBlocker,
      }),
    });

    setNewNote("");
    setIsBlocker(false);
    setSubmitting(false);
    router.refresh();
  }

  async function handleToggleResolved(noteId: string, resolved: boolean) {
    await fetch(`/api/notes/${noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isResolved: !resolved }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Add Note */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Add Note</h3>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          rows={3}
        />
        <div className="mt-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={isBlocker}
              onChange={(e) => setIsBlocker(e.target.checked)}
              className="rounded border-border"
            />
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            Mark as blocker
          </label>
          <Button
            onClick={handleAddNote}
            disabled={!newNote.trim() || submitting}
            size="sm"
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add Note
          </Button>
        </div>
      </div>

      {/* Notes List */}
      {location.notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare className="mb-3 h-8 w-8 text-[#27272a]" />
          <p className="text-sm text-muted-foreground">No notes yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {location.notes.map((note) => (
            <div
              key={note.id}
              className={`rounded-lg border p-4 ${
                note.isBlocker && !note.isResolved
                  ? "border-destructive/20 bg-status-blocked-bg"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {note.isBlocker && (
                    <div className="mb-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span className="text-[11px] font-medium uppercase tracking-wider text-destructive">
                        Blocker
                      </span>
                      {note.isResolved && (
                        <span className="ml-1 text-[11px] text-status-live">
                          (Resolved)
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-sm text-foreground">{note.body}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{note.author}</span>
                    <span>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {note.isBlocker && (
                  <button
                    onClick={() =>
                      handleToggleResolved(note.id, note.isResolved)
                    }
                    className={`rounded-md px-2.5 py-1 text-xs ${
                      note.isResolved
                        ? "bg-muted text-muted-foreground"
                        : "bg-status-live-bg text-status-live"
                    }`}
                  >
                    {note.isResolved ? "Unresolve" : (
                      <span className="flex items-center gap-1">
                        <Check className="h-3 w-3" /> Resolve
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
