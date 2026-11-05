-- CreateTable
CREATE TABLE "UserConditions" (
    "userId" TEXT NOT NULL,
    "conditions" JSONB NOT NULL,
    "consentedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserConditions_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "UserConditions" ADD CONSTRAINT "UserConditions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
