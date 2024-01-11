/*
  Warnings:

  - A unique constraint covering the columns `[push_token]` on the table `device` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `device` MODIFY `build_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `device_push_token_key` ON `device`(`push_token`);
