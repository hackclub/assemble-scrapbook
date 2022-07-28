/*
  Warnings:

  - You are about to drop the column `isLargeVideo` on the `Updates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "stream" TEXT;

-- AlterTable
ALTER TABLE "Updates" DROP COLUMN "isLargeVideo",
ADD COLUMN     "isShip" BOOLEAN DEFAULT false;
