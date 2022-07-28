-- CreateTable
CREATE TABLE "Reactions" (
    "id" TEXT NOT NULL,
    "accountID" TEXT,
    "emoji" TEXT NOT NULL,
    "updateId" TEXT NOT NULL,

    CONSTRAINT "Reactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reactions" ADD CONSTRAINT "Reactions_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reactions" ADD CONSTRAINT "Reactions_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "Updates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
