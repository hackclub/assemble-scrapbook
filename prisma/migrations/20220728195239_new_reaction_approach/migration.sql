/*
  Warnings:

  - You are about to drop the column `amount` on the `Reactions` table. All the data in the column will be lost.
  - The `emoji` column on the `Reactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Reactions" DROP COLUMN "amount",
DROP COLUMN "emoji",
ADD COLUMN     "emoji" TEXT[];
