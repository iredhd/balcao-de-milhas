-- AlterTable
ALTER TABLE `buyer_verification` MODIFY `status` ENUM('PENDING', 'COMPLETED', 'DENIED', 'WAITING_MANUAL_ACTION', 'APPROVED') NOT NULL DEFAULT 'PENDING';
