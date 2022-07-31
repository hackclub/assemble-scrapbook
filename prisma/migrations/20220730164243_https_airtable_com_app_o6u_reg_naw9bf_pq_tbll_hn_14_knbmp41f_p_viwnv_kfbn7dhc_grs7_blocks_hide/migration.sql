/*
  Warnings:

  - You are about to drop the column `accountId` on the `Collab` table. All the data in the column will be lost.
  - Added the required column `accountUsername` to the `Collab` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Collab" DROP CONSTRAINT "Collab_accountId_fkey";

-- AlterTable
ALTER TABLE "Collab" DROP COLUMN "accountId",
ADD COLUMN     "accountUsername" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Collab" ADD CONSTRAINT "Collab_accountUsername_fkey" FOREIGN KEY ("accountUsername") REFERENCES "Account"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
