/*
  Warnings:

  - Added the required column `amount` to the `Reactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reactions" ADD COLUMN     "amount" INTEGER NOT NULL;
