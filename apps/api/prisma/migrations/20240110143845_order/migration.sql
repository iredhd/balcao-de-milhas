/*
  Warnings:

  - A unique constraint covering the columns `[buyer_id]` on the table `user_verification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `buyer_id` to the `user_verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_verification` ADD COLUMN `buyer_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_verification_buyer_id_key` ON `user_verification`(`buyer_id`);

-- AddForeignKey
ALTER TABLE `user_verification` ADD CONSTRAINT `user_verification_buyer_id_fkey` FOREIGN KEY (`buyer_id`) REFERENCES `buyer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
