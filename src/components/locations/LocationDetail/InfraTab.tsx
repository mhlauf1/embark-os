import type { LocationWithRelations } from "@/types";
import { StatusPill } from "../StatusPill";
import { CopyButton } from "@/components/shared/CopyButton";

interface Props {
  location: LocationWithRelations;
}

export function InfraTab({ location }: Props) {
  return (
    <div className="space-y-6">
      {/* DNS & Domain */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          DNS & Domain
        </h3>
        <dl className="space-y-3">
          {location.domainRegistrar && (
            <InfoRow label="Registrar" value={location.domainRegistrar} />
          )}
          {location.dnsProvider && (
            <InfoRow label="DNS Provider" value={location.dnsProvider} />
          )}
          {location.nameservers && (
            <div className="flex items-start justify-between">
              <dt className="text-sm text-muted-foreground">Nameservers</dt>
              <dd className="text-right">
                <div className="flex items-center gap-2">
                  <span className="font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
                    {location.nameservers}
                  </span>
                  <CopyButton text={location.nameservers} />
                </div>
              </dd>
            </div>
          )}
          {location.hostingProvider && (
            <InfoRow label="Hosting" value={location.hostingProvider} />
          )}
        </dl>
      </div>

      {/* Email */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          Email Infrastructure
        </h3>
        <dl className="space-y-3">
          {location.emailPlatform && (
            <InfoRow label="Platform" value={location.emailPlatform} />
          )}
          {location.mxStatus && (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">MX Records</dt>
              <dd><StatusPill status={location.mxStatus} /></dd>
            </div>
          )}
          {location.spfStatus && (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">SPF</dt>
              <dd><StatusPill status={location.spfStatus} /></dd>
            </div>
          )}
          {location.dkimStatus && (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">DKIM</dt>
              <dd><StatusPill status={location.dkimStatus} /></dd>
            </div>
          )}
        </dl>
      </div>

      {/* Secondary Domain */}
      {location.secondaryDomain && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Secondary Domain
          </h3>
          <dl className="space-y-3">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Domain</dt>
              <dd className="flex items-center gap-2">
                <span className="font-[family-name:var(--font-geist-mono)] text-sm text-foreground">
                  {location.secondaryDomain}
                </span>
                <CopyButton text={location.secondaryDomain} />
              </dd>
            </div>
            {location.secondaryDomainNotes && (
              <div>
                <dt className="text-sm text-muted-foreground">Notes</dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {location.secondaryDomainNotes}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Infra Notes */}
      {location.infraNotes && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            Infrastructure Notes
          </h3>
          <p className="text-sm text-foreground">{location.infraNotes}</p>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}
