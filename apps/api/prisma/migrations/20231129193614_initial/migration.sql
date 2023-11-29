-- CreateTable
CREATE TABLE `bid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `offer_id` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `pax` INTEGER NOT NULL,
    `cancell_return_percentage` DECIMAL(65, 30) NOT NULL,
    `direction` ENUM('BUY', 'SELL') NOT NULL,
    `is_vcm` BOOLEAN NOT NULL,

    UNIQUE INDEX `bid_offer_id_key`(`offer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `title` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ip` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `headers` JSON NOT NULL,
    `body` JSON NOT NULL,
    `method` ENUM('GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
