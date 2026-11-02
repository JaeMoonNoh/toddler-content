/*
  Warnings:

  - You are about to drop the column `sourceName` on the `Benefit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Benefit" DROP COLUMN "sourceName";

-- CreateTable
CREATE TABLE "BenefitSource" (
    "id" TEXT NOT NULL,
    "benefitId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "source" "DataSource" NOT NULL,
    "externalId" TEXT NOT NULL,
    "verifiedHash" TEXT,
    "verifiedPayload" JSONB,

    CONSTRAINT "BenefitSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BenefitSource_source_externalId_idx" ON "BenefitSource"("source", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "BenefitSource_benefitId_source_externalId_key" ON "BenefitSource"("benefitId", "source", "externalId");

-- AddForeignKey
ALTER TABLE "BenefitSource" ADD CONSTRAINT "BenefitSource_benefitId_fkey" FOREIGN KEY ("benefitId") REFERENCES "Benefit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
