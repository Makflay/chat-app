/*
  Warnings:

  - A unique constraint covering the columns `[systemKey]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `chat` ADD COLUMN `isDefault` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ownerUserId` INTEGER NULL,
    ADD COLUMN `systemKey` VARCHAR(191) NULL,
    MODIFY `type` ENUM('PRIVATE', 'GROUP', 'ASSISTANT') NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isBot` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `Chat_systemKey_key` ON `Chat`(`systemKey`);
