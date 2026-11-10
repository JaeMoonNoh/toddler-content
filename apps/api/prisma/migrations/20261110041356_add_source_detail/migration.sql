-- CreateTable
CREATE TABLE "SourceDetail" (
    "id" TEXT NOT NULL,
    "source" "DataSource" NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "changedAt" TIMESTAMP(3),

    CONSTRAINT "SourceDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceDetailChange" (
    "id" TEXT NOT NULL,
    "detailId" TEXT NOT NULL,
    "changedFields" JSONB NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SourceDetailChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SourceDetail_source_externalId_key" ON "SourceDetail"("source", "externalId");

-- CreateIndex
CREATE INDEX "SourceDetailChange_detailId_idx" ON "SourceDetailChange"("detailId");

-- CreateIndex
CREATE INDEX "SourceDetailChange_detectedAt_idx" ON "SourceDetailChange"("detectedAt");

-- AddForeignKey
ALTER TABLE "SourceDetailChange" ADD CONSTRAINT "SourceDetailChange_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "SourceDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
