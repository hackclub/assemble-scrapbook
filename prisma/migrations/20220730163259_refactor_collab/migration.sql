/*
  Warnings:

  - You are about to drop the column `collaborators` on the `Updates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Updates" DROP COLUMN "collaborators";

-- CreateTable
CREATE TABLE "Collab" (
    "id" TEXT NOT NULL,
    "updateId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Collab_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Collab" ADD CONSTRAINT "Collab_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collab" ADD CONSTRAINT "Collab_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "Updates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
