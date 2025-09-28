-- 1️⃣ Drop da coluna antiga e criação das novas colunas como opcionais
ALTER TABLE "public"."GeneralExpense"
DROP COLUMN "dueDate",
ADD COLUMN "business" TEXT,
ADD COLUMN "date" TIMESTAMP(3),
ADD COLUMN "dueDay" INTEGER,
ADD COLUMN "installmentNumber" INTEGER,
ADD COLUMN "installmentTotal" INTEGER,
ADD COLUMN "parentId" TEXT;

-- 2️⃣ Popular valores das colunas obrigatórias para as linhas existentes
UPDATE "public"."GeneralExpense" SET "date" = NOW() WHERE "date" IS NULL;
UPDATE "public"."GeneralExpense" SET "dueDay" = 1 WHERE "dueDay" IS NULL;

-- 3️⃣ Tornar as colunas NOT NULL após popular os dados
ALTER TABLE "public"."GeneralExpense"
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "dueDay" SET NOT NULL;

-- 4️⃣ Adicionar a foreign key do parentId
ALTER TABLE "public"."GeneralExpense"
ADD CONSTRAINT "GeneralExpense_parentId_fkey"
FOREIGN KEY ("parentId") REFERENCES "public"."GeneralExpense"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
