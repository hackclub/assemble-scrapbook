/*
  Warnings:

  - You are about to drop the column `accountUsername` on the `Updates` table. All the data in the column will be lost.
  - You are about to drop the column `backupAssetID` on the `Updates` table. All the data in the column will be lost.
  - You are about to drop the column `backupPlaybackID` on the `Updates` table. All the data in the column will be lost.
  - You are about to drop the column `muxAssetIDs` on the `Updates` table. All the data in the column will be lost.
  - You are about to drop the column `muxAssetStatuses` on the `Updates` table. All the data in the column will be lost.
  - You are about to drop the column `muxPlaybackIDs` on the `Updates` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Updates" DROP CONSTRAINT "Updates_accountUsername_fkey";

-- AlterTable
ALTER TABLE "Updates" DROP COLUMN "accountUsername",
DROP COLUMN "backupAssetID",
DROP COLUMN "backupPlaybackID",
DROP COLUMN "muxAssetIDs",
DROP COLUMN "muxAssetStatuses",
DROP COLUMN "muxPlaybackIDs",
ADD COLUMN     "accountID" TEXT;

-- AddForeignKey
ALTER TABLE "Updates" ADD CONSTRAINT "Updates_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
