-- AlterTable
ALTER TABLE "Benefit" ADD COLUMN     "conditions" TEXT[] DEFAULT ARRAY[]::TEXT[];
