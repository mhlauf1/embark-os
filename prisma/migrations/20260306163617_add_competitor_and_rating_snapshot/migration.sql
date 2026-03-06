-- CreateTable
CREATE TABLE "RatingSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locationId" TEXT NOT NULL,
    "googleRating" REAL NOT NULL,
    "googleReviewCount" INTEGER NOT NULL,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RatingSnapshot_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Competitor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "googleRating" REAL,
    "googleReviewCount" INTEGER,
    "notes" TEXT,
    "serviceBoarding" BOOLEAN NOT NULL DEFAULT false,
    "serviceDaycare" BOOLEAN NOT NULL DEFAULT false,
    "serviceGrooming" BOOLEAN NOT NULL DEFAULT false,
    "serviceTraining" BOOLEAN NOT NULL DEFAULT false,
    "serviceVetCare" BOOLEAN NOT NULL DEFAULT false,
    "serviceGroomingEd" BOOLEAN NOT NULL DEFAULT false,
    "serviceWebcams" BOOLEAN NOT NULL DEFAULT false,
    "serviceMobileGroom" BOOLEAN NOT NULL DEFAULT false,
    "serviceRetail" BOOLEAN NOT NULL DEFAULT false,
    "lighthousePerf" INTEGER,
    "lighthouseA11y" INTEGER,
    "lighthouseSEO" INTEGER,
    "lighthouseBP" INTEGER,
    "lighthouseMobilePerf" INTEGER,
    "lighthouseMobileA11y" INTEGER,
    "lighthouseMobileSEO" INTEGER,
    "lighthouseMobileBP" INTEGER,
    "lighthouseAudited" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Competitor_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "RatingSnapshot_locationId_recordedAt_idx" ON "RatingSnapshot"("locationId", "recordedAt");
