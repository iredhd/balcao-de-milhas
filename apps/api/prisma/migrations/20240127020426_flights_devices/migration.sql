-- CreateTable
CREATE TABLE `flights_app_device` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `device_info` JSON NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `os` VARCHAR(191) NOT NULL,
    `push_token` VARCHAR(191) NULL,
    `device_id` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `last_ip` VARCHAR(191) NOT NULL,
    `last_use_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `flights_app_device_push_token_key`(`push_token`),
    UNIQUE INDEX `flights_app_device_device_id_key`(`device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
