-- AlterTable
ALTER TABLE `buyer` ADD COLUMN `address_cep` VARCHAR(191) NULL,
    ADD COLUMN `address_city` VARCHAR(191) NULL,
    ADD COLUMN `address_complement` VARCHAR(191) NULL,
    ADD COLUMN `address_country` VARCHAR(191) NULL,
    ADD COLUMN `address_neighborhood` VARCHAR(191) NULL,
    ADD COLUMN `address_number` VARCHAR(191) NULL,
    ADD COLUMN `address_state` VARCHAR(191) NULL,
    ADD COLUMN `address_street` VARCHAR(191) NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NULL;
