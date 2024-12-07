-- CreateEnum
CREATE TYPE "ShopStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'DELETED');

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "status" "ShopStatus" NOT NULL DEFAULT 'ACTIVE';
