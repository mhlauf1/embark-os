"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LocationWithRelations } from "@/types";
import type { Contact } from "@prisma/client";
import { ROLE_LABELS, CONTACT_ROLES } from "@/lib/constants";
import { CopyButton } from "@/components/shared/CopyButton";
import { InlineEditField } from "@/components/shared/InlineEditField";
import { InlineSelectField } from "@/components/shared/InlineSelectField";
import { InlineToggleField } from "@/components/shared/InlineToggleField";
import { Mail, Phone, Building2, Star, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  location: LocationWithRelations;
}

const roleOptions = CONTACT_ROLES.map((r) => ({
  value: r,
  label: ROLE_LABELS[r] ?? r,
}));

export function ContactsTab({ location }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  async function updateContact(contactId: string, field: string, value: unknown): Promise<boolean> {
    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Saved", { duration: 2000 });
      router.refresh();
      return true;
    } catch {
      toast.error("Failed to save");
      return false;
    }
  }

  async function deleteContact(contactId: string, name: string) {
    if (!confirm(`Delete contact "${name}"?`)) return;
    try {
      const res = await fetch(`/api/contacts/${contactId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Deleted", { description: `Removed ${name}`, duration: 2000 });
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Contact Button / Form */}
      {showForm ? (
        <AddContactForm
          locationId={location.id}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            router.refresh();
          }}
        />
      ) : (
        <Button
          onClick={() => setShowForm(true)}
          size="sm"
          className="bg-primary text-white hover:bg-primary/90"
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Contact
        </Button>
      )}

      {/* Contact Cards */}
      {location.contacts.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Building2 className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No contacts yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {location.contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onUpdate={updateContact}
              onDelete={deleteContact}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ContactCard({
  contact,
  onUpdate,
  onDelete,
}: {
  contact: Contact;
  onUpdate: (id: string, field: string, value: unknown) => Promise<boolean>;
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <div className="group/card rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <InlineEditField
              value={contact.name}
              onSave={(v) => onUpdate(contact.id, "name", v)}
              className="font-medium text-foreground"
            />
            <div className="flex items-center gap-1">
              <Star
                className={`h-3.5 w-3.5 cursor-pointer transition-colors ${
                  contact.isPrimary
                    ? "fill-warning text-warning"
                    : "text-muted-foreground hover:text-warning"
                }`}
                onClick={() => onUpdate(contact.id, "isPrimary", !contact.isPrimary)}
              />
            </div>
          </div>
          <div className="mt-1">
            <InlineSelectField
              value={contact.role}
              options={roleOptions}
              onSave={(v) => onUpdate(contact.id, "role", v)}
            />
          </div>
        </div>
        <button
          onClick={() => onDelete(contact.id, contact.name)}
          className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-status-blocked-bg hover:text-destructive group-hover/card:opacity-100"
          aria-label="Delete contact"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <InlineEditField
            value={contact.company ?? ""}
            onSave={(v) => onUpdate(contact.id, "company", v || null)}
            placeholder="Add company"
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <InlineEditField
            value={contact.email ?? ""}
            onSave={(v) => onUpdate(contact.id, "email", v || null)}
            placeholder="Add email"
          />
          {contact.email && <CopyButton text={contact.email} />}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <InlineEditField
            value={contact.phone ?? ""}
            onSave={(v) => onUpdate(contact.id, "phone", v || null)}
            placeholder="Add phone"
          />
          {contact.phone && <CopyButton text={contact.phone} />}
        </div>
        <div className="mt-2">
          <InlineEditField
            value={contact.notes ?? ""}
            onSave={(v) => onUpdate(contact.id, "notes", v || null)}
            placeholder="Add notes"
            multiline
          />
        </div>
      </div>
    </div>
  );
}

function AddContactForm({
  locationId,
  onClose,
  onSaved,
}: {
  locationId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("operations");
  const [company, setCompany] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId,
          name: name.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          role,
          company: company.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      toast.success("Contact added", { description: name, duration: 2000 });
      onSaved();
    } catch {
      toast.error("Failed to add contact");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-primary/20 bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">New Contact</h3>
        <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name *"
          required
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          {CONTACT_ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r] ?? r}
            </option>
          ))}
        </select>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:col-span-2"
        />
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!name.trim() || saving}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {saving ? "Adding..." : "Add Contact"}
          </Button>
        </div>
      </form>
    </div>
  );
}
