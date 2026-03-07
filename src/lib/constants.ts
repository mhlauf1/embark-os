export const MIGRATION_STATUSES = [
  "not-started",
  "recon",
  "stakeholder-outreach",
  "access-gathered",
  "in-execution",
  "complete",
] as const;

export const REBUILD_STATUSES = [
  "not-scoped",
  "scoped",
  "in-design",
  "in-development",
  "in-review",
  "live",
] as const;

export const PLATFORMS = [
  "wix",
  "wordpress",
  "squarespace",
  "ghl",
  "webflow",
  "nextjs",
  "custom",
  "unknown",
  "none",
] as const;

export const EMAIL_PLATFORMS = [
  "m365",
  "google-workspace",
  "cpanel",
  "none",
] as const;

export const DNS_STATUSES = [
  "correct",
  "misconfigured",
  "missing",
  "unknown",
] as const;

export const CONTACT_ROLES = [
  "owner",
  "operations",
  "it-dns",
  "marketing-agency",
  "billing",
  "facility-manager",
] as const;

export const FACILITY_TYPES = [
  "multi-service",
  "grooming",
  "boarding",
  "training",
] as const;

export const MIGRATION_STATUS_LABELS: Record<string, string> = {
  "not-started": "Not Started",
  recon: "Recon",
  "stakeholder-outreach": "Stakeholder Outreach",
  "access-gathered": "Access Gathered",
  "in-execution": "In Execution",
  complete: "Complete",
};

export const REBUILD_STATUS_LABELS: Record<string, string> = {
  "not-scoped": "Not Scoped",
  scoped: "Scoped",
  "in-design": "In Design",
  "in-development": "In Development",
  "in-review": "In Review",
  live: "Live",
};

export const PLATFORM_LABELS: Record<string, string> = {
  wix: "Wix",
  wordpress: "WordPress",
  squarespace: "Squarespace",
  ghl: "GHL",
  webflow: "Webflow",
  nextjs: "Next.js",
  custom: "Custom",
  unknown: "Unknown",
  none: "None",
};

export const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  operations: "Operations",
  "it-dns": "IT / DNS",
  "marketing-agency": "Marketing Agency",
  billing: "Billing",
  "facility-manager": "Facility Manager",
};

export const ENGAGEMENT_TIERS = [
  "lauf-built",
  "in-development",
  "onboarding",
  "not-engaged",
] as const;

export const ENGAGEMENT_TIER_LABELS: Record<string, string> = {
  "lauf-built": "Lauf Built",
  "in-development": "In Development",
  onboarding: "Onboarding",
  "not-engaged": "Not Engaged",
};

export type EngagementTier = (typeof ENGAGEMENT_TIERS)[number];
export type MigrationStatus = (typeof MIGRATION_STATUSES)[number];
export type RebuildStatus = (typeof REBUILD_STATUSES)[number];
export type Platform = (typeof PLATFORMS)[number];
