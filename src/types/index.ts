import type { Location, Contact, Note } from "@prisma/client";

export type { Location, Contact, Note };

export type LocationWithRelations = Location & {
  contacts: Contact[];
  notes: Note[];
};

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
