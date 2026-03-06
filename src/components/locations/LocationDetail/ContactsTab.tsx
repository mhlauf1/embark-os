import type { LocationWithRelations } from "@/types";
import { ROLE_LABELS } from "@/lib/constants";
import { CopyButton } from "@/components/shared/CopyButton";
import { Mail, Phone, Building2, Star } from "lucide-react";

interface Props {
  location: LocationWithRelations;
}

export function ContactsTab({ location }: Props) {
  if (location.contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Building2 className="mb-3 h-8 w-8 text-[#27272a]" />
        <p className="text-sm text-muted-foreground">No contacts yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {location.contacts.map((contact) => (
        <div
          key={contact.id}
          className="rounded-lg border border-border bg-card p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground">{contact.name}</h4>
                {contact.isPrimary && (
                  <Star className="h-3.5 w-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                )}
              </div>
              <span className="mt-0.5 inline-block rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {ROLE_LABELS[contact.role] ?? contact.role}
              </span>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {contact.company && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                {contact.company}
              </div>
            )}
            {contact.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-foreground">{contact.email}</span>
                <CopyButton text={contact.email} />
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-foreground">{contact.phone}</span>
                <CopyButton text={contact.phone} />
              </div>
            )}
            {contact.notes && (
              <p className="mt-2 text-xs text-muted-foreground">{contact.notes}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
