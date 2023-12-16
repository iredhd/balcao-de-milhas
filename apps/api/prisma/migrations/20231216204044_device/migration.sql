/*
  Warnings:

  - A unique constraint covering the columns `[push_token]` on the table `device` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `device_push_token_key` ON `device`(`push_token`);
