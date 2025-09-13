-- AlterTable
ALTER TABLE "public"."GeneralExpense" ADD COLUMN     "monthReference" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "yearReference" INTEGER NOT NULL DEFAULT 2025;

-- AlterTable
ALTER TABLE "public"."HousingBill" ADD COLUMN     "monthReference" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "yearReference" INTEGER NOT NULL DEFAULT 2025;
