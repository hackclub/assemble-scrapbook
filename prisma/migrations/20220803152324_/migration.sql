/*
  Warnings:

  - A unique constraint covering the columns `[assembleId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "assembleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_assembleId_key" ON "Account"("assembleId");
