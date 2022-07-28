/*
  Warnings:

  - You are about to drop the column `accountID` on the `Reactions` table. All the data in the column will be lost.
  - Added the required column `cookie` to the `Reactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reactions" DROP CONSTRAINT "Reactions_accountID_fkey";

-- AlterTable
ALTER TABLE "Reactions" DROP COLUMN "accountID",
ADD COLUMN     "cookie" TEXT NOT NULL;
