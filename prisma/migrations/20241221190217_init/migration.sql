/*
  Warnings:

  - You are about to alter the column `sensorValue` on the `Measurement` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Measurement` MODIFY `sensorValue` VARCHAR(191) NOT NULL;
