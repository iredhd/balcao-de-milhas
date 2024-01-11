/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `buyer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `buyer_document_key` ON `buyer`(`document`);
