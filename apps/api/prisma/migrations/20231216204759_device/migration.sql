/*
  Warnings:

  - A unique constraint covering the columns `[build_id]` on the table `device` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `build_id` to the `device` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `device_push_token_key` ON `device`;

-- AlterTable
ALTER TABLE `device` ADD COLUMN `build_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `device_build_id_key` ON `device`(`build_id`);
