-- CreateTable
CREATE TABLE "SeoSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locationId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "letterGrade" TEXT NOT NULL,
    "responseTimeMs" INTEGER NOT NULL,
    "checkResults" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SeoSnapshot_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SeoSnapshot_locationId_createdAt_idx" ON "SeoSnapshot"("locationId", "createdAt");
