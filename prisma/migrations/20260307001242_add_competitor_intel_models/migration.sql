-- AlterTable
ALTER TABLE "Competitor" ADD COLUMN "placeId" TEXT;
ALTER TABLE "Competitor" ADD COLUMN "seoGrade" TEXT;
ALTER TABLE "Competitor" ADD COLUMN "seoScore" INTEGER;

-- CreateTable
CREATE TABLE "CompetitorSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "competitorId" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "scorePerf" INTEGER NOT NULL,
    "scoreA11y" INTEGER NOT NULL,
    "scoreSEO" INTEGER NOT NULL,
    "scoreBP" INTEGER NOT NULL,
    "overallScore" REAL NOT NULL,
    "letterGrade" TEXT NOT NULL,
    "auditDetails" TEXT NOT NULL,
    "seoScore" INTEGER,
    "seoGrade" TEXT,
    "seoChecks" TEXT,
    "responseTimeMs" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CompetitorSnapshot_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompetitorRatingSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "competitorId" TEXT NOT NULL,
    "googleRating" REAL NOT NULL,
    "googleReviewCount" INTEGER NOT NULL,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CompetitorRatingSnapshot_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AIVisibilityCheck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locationId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "promptSlug" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "mentionsEmbark" BOOLEAN NOT NULL DEFAULT false,
    "embarkPosition" INTEGER,
    "mentionedNames" TEXT NOT NULL,
    "competitorsMentioned" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AIVisibilityCheck_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CompetitorSnapshot_competitorId_strategy_createdAt_idx" ON "CompetitorSnapshot"("competitorId", "strategy", "createdAt");

-- CreateIndex
CREATE INDEX "CompetitorRatingSnapshot_competitorId_recordedAt_idx" ON "CompetitorRatingSnapshot"("competitorId", "recordedAt");

-- CreateIndex
CREATE INDEX "AIVisibilityCheck_locationId_promptSlug_createdAt_idx" ON "AIVisibilityCheck"("locationId", "promptSlug", "createdAt");
