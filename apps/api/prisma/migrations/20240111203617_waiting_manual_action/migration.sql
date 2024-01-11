/*
  Warnings:

  - The values [WAITING_MANUAL_ACTION] on the enum `buyer_verification_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `buyer_verification` MODIFY `status` ENUM('PENDING', 'COMPLETED', 'DENIED', 'APPROVED') NOT NULL DEFAULT 'PENDING';
