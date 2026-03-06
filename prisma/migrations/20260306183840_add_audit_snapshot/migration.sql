-- CreateTable
CREATE TABLE "AuditSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locationId" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "scorePerf" INTEGER NOT NULL,
    "scoreA11y" INTEGER NOT NULL,
    "scoreSEO" INTEGER NOT NULL,
    "scoreBP" INTEGER NOT NULL,
    "overallScore" REAL NOT NULL,
    "letterGrade" TEXT NOT NULL,
    "auditDetails" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditSnapshot_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "AuditSnapshot_locationId_strategy_createdAt_idx" ON "AuditSnapshot"("locationId", "strategy", "createdAt");
