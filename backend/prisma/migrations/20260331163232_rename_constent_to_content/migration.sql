/*
  Warnings:

  - You are about to drop the column `constent` on the `message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `message` DROP COLUMN `constent`,
    ADD COLUMN `content` VARCHAR(191) NULL;
