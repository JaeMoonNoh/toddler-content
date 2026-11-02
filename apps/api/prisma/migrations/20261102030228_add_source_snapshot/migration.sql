-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('GOV24', 'BOKJIRO_NATIONAL', 'BOKJIRO_LOCAL');

-- CreateEnum
CREATE TYPE "ChangeType" AS ENUM ('ADDED', 'UPDATED', 'REMOVED');

-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateTable
CREATE TABLE "SourceItem" (
    "id" TEXT NOT NULL,
    "source" "DataSource" NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "hash" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removedAt" TIMESTAMP(3),

    CONSTRAINT "SourceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceChange" (
    "id" TEXT NOT NULL,
    "type" "ChangeType" NOT NULL,
    "itemId" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "changedFields" JSONB,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SourceChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionRun" (
    "id" TEXT NOT NULL,
    "source" "DataSource" NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'RUNNING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "itemCount" INTEGER,
    "added" INTEGER NOT NULL DEFAULT 0,
    "updated" INTEGER NOT NULL DEFAULT 0,
    "removed" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,

    CONSTRAINT "CollectionRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SourceItem_source_externalId_key" ON "SourceItem"("source", "externalId");

-- CreateIndex
CREATE INDEX "SourceChange_runId_idx" ON "SourceChange"("runId");

-- CreateIndex
CREATE INDEX "SourceChange_detectedAt_idx" ON "SourceChange"("detectedAt");

-- CreateIndex
CREATE INDEX "CollectionRun_source_startedAt_idx" ON "CollectionRun"("source", "startedAt");

-- AddForeignKey
ALTER TABLE "SourceChange" ADD CONSTRAINT "SourceChange_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "SourceItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceChange" ADD CONSTRAINT "SourceChange_runId_fkey" FOREIGN KEY ("runId") REFERENCES "CollectionRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
