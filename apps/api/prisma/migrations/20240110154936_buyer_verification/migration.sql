/*
  Warnings:

  - You are about to drop the `user_verification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_verification` DROP FOREIGN KEY `user_verification_buyer_id_fkey`;

-- DropTable
DROP TABLE `user_verification`;

-- CreateTable
CREATE TABLE `buyer_verification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `external_id` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'DENIED', 'APPROVED') NOT NULL DEFAULT 'PENDING',
    `buyer_id` INTEGER NOT NULL,

    UNIQUE INDEX `buyer_verification_external_id_key`(`external_id`),
    UNIQUE INDEX `buyer_verification_buyer_id_key`(`buyer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `buyer_verification` ADD CONSTRAINT `buyer_verification_buyer_id_fkey` FOREIGN KEY (`buyer_id`) REFERENCES `buyer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
