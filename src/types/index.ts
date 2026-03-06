import type { Location, Contact, Note, Competitor, RatingSnapshot, AuditSnapshot, SeoSnapshot } from "@prisma/client";

export type { Location, Contact, Note, Competitor, RatingSnapshot, AuditSnapshot, SeoSnapshot };

export type LocationWithRelations = Location & {
  contacts: Contact[];
  notes: Note[];
  competitors: Competitor[];
  ratingSnapshots: RatingSnapshot[];
  auditSnapshots: AuditSnapshot[];
  seoSnapshots: SeoSnapshot[];
};

export interface SeoCheckResult {
  id: string;
  name: string;
  category: "meta" | "content" | "technical" | "structured-data";
  weight: number;
  status: "pass" | "warn" | "fail";
  score: number; // 1, 0.5, or 0
  message: string;
  details?: string;
}

export interface SeoRecommendation {
  checkId: string;
  priority: "critical" | "important" | "minor";
  title: string;
  impact: string;
  explanation: string;
  suggestion: string;
  codeSnippet?: string;
  currentValue?: string;
}

export type ServiceKey =
  | "serviceBoarding"
  | "serviceDaycare"
  | "serviceGrooming"
  | "serviceTraining"
  | "serviceVetCare"
  | "serviceGroomingEd"
  | "serviceWebcams"
  | "serviceMobileGroom"
  | "serviceRetail";

export const SERVICE_LABELS: Record<ServiceKey, string> = {
  serviceBoarding: "Boarding",
  serviceDaycare: "Daycare",
  serviceGrooming: "Grooming",
  serviceTraining: "Training",
  serviceVetCare: "Vet Care",
  serviceGroomingEd: "Grooming Ed",
  serviceWebcams: "Webcams",
  serviceMobileGroom: "Mobile Grooming",
  serviceRetail: "Retail",
};
