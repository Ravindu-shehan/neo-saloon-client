/*
  Warnings:

  - You are about to drop the column `userId` on the `Media` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "altNames" TEXT[],
ALTER COLUMN "description" SET DEFAULT '';
