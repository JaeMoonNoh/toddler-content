-- CreateEnum
CREATE TYPE "SavedBenefitState" AS ENUM ('TODO', 'APPLIED');

-- CreateTable
CREATE TABLE "SavedBenefit" (
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "state" "SavedBenefitState" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedBenefit_pkey" PRIMARY KEY ("userId","slug")
);

-- AddForeignKey
ALTER TABLE "SavedBenefit" ADD CONSTRAINT "SavedBenefit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
