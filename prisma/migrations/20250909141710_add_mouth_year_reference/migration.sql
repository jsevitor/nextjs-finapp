-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "monthReference" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "yearReference" INTEGER NOT NULL DEFAULT 2025;
