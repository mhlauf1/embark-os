"use client";

import type { LocationWithRelations } from "@/types";
import { StatusPill } from "../StatusPill";
import { CopyButton } from "@/components/shared/CopyButton";
import { InlineEditField } from "@/components/shared/InlineEditField";
import { InlineSelectField } from "@/components/shared/InlineSelectField";
import { DNS_STATUSES, EMAIL_PLATFORMS } from "@/lib/constants";

interface Props {
  location: LocationWithRelations;
  onUpdate: (field: string, value: unknown) => Promise<boolean>;
}

const dnsStatusOptions = DNS_STATUSES.map((s) => ({
  value: s,
  label: s.charAt(0).toUpperCase() + s.slice(1),
}));

const emailPlatformOptions = EMAIL_PLATFORMS.map((p) => ({
  value: p,
  label: p === "m365" ? "M365" : p === "google-workspace" ? "Google Workspace" : p === "cpanel" ? "cPanel" : "None",
}));

export function InfraTab({ location, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      {/* DNS & Domain */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          DNS & Domain
        </h3>
        <dl className="space-y-3">
          <EditableInfoRow label="Registrar">
            <InlineEditField
              value={location.domainRegistrar ?? ""}
              onSave={(v) => onUpdate("domainRegistrar", v || null)}
              placeholder="Add registrar"
            />
          </EditableInfoRow>
          <EditableInfoRow label="DNS Provider">
            <InlineEditField
              value={location.dnsProvider ?? ""}
              onSave={(v) => onUpdate("dnsProvider", v || null)}
              placeholder="Add DNS provider"
            />
          </EditableInfoRow>
          <div className="flex items-start justify-between">
            <dt className="text-sm text-muted-foreground">Nameservers</dt>
            <dd className="text-right">
              <div className="flex items-center gap-2">
                <InlineEditField
                  value={location.nameservers ?? ""}
                  onSave={(v) => onUpdate("nameservers", v || null)}
                  placeholder="Add nameservers"
                  mono
                />
                {location.nameservers && (
                  <CopyButton text={location.nameservers} />
                )}
              </div>
            </dd>
          </div>
          <EditableInfoRow label="Hosting">
            <InlineEditField
              value={location.hostingProvider ?? ""}
              onSave={(v) => onUpdate("hostingProvider", v || null)}
              placeholder="Add hosting"
            />
          </EditableInfoRow>
        </dl>
      </div>

      {/* Email */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Email Infrastructure
        </h3>
        <dl className="space-y-3">
          <EditableInfoRow label="Platform">
            <InlineSelectField
              value={location.emailPlatform ?? "none"}
              options={emailPlatformOptions}
              onSave={(v) => onUpdate("emailPlatform", v)}
            />
          </EditableInfoRow>
          {location.mxStatus && (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">MX Records</dt>
              <dd>
                <StatusPill
                  status={location.mxStatus}
                  options={dnsStatusOptions}
                  onSave={(v) => onUpdate("mxStatus", v)}
                />
              </dd>
            </div>
          )}
          {location.spfStatus && (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">SPF</dt>
              <dd>
                <StatusPill
                  status={location.spfStatus}
                  options={dnsStatusOptions}
                  onSave={(v) => onUpdate("spfStatus", v)}
                />
              </dd>
            </div>
          )}
          {location.dkimStatus && (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">DKIM</dt>
              <dd>
                <StatusPill
                  status={location.dkimStatus}
                  options={dnsStatusOptions}
                  onSave={(v) => onUpdate("dkimStatus", v)}
                />
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Secondary Domain */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Secondary Domain
        </h3>
        <dl className="space-y-3">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-muted-foreground">Domain</dt>
            <dd className="flex items-center gap-2">
              <InlineEditField
                value={location.secondaryDomain ?? ""}
                onSave={(v) => onUpdate("secondaryDomain", v || null)}
                placeholder="Add secondary domain"
                mono
              />
              {location.secondaryDomain && (
                <CopyButton text={location.secondaryDomain} />
              )}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-sm text-muted-foreground">Notes</dt>
            <InlineEditField
              value={location.secondaryDomainNotes ?? ""}
              onSave={(v) => onUpdate("secondaryDomainNotes", v || null)}
              placeholder="Add notes"
              multiline
            />
          </div>
        </dl>
      </div>

      {/* Infra Notes */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Infrastructure Notes
        </h3>
        <InlineEditField
          value={location.infraNotes ?? ""}
          onSave={(v) => onUpdate("infraNotes", v || null)}
          placeholder="Add infrastructure notes"
          multiline
        />
      </div>
    </div>
  );
}

function EditableInfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
