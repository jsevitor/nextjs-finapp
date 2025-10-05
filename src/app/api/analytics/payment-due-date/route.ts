// src/app/api/analytics/payment-due-date/route.ts
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ajuste o caminho conforme sua estrutura

// Tipagens para as entidades retornadas do Prisma
type GeneralExpenseItem = {
  id: string;
  description: string | null;
  amount: number;
  dueDay: number;
  monthReference: number;
  yearReference: number;
  category: { name: string | null } | null; // 🔹 aceita null
};

type HousingBillItem = {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  category: { name: string | null } | null; // 🔹 aceita null
};

type CardItem = {
  id: string;
  name: string;
  dueDay: number;
};

type TransactionItem = {
  id: string;
  cardId: string;
  amount: number;
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const isVitor = userEmail === "jvoliveer@gmail.com"; // troque pelo seu e-mail

    const { searchParams } = new URL(req.url);
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (!month || !year || isNaN(month) || isNaN(year)) {
      return NextResponse.json(
        { error: "`month` e `year` são obrigatórios e devem ser números" },
        { status: 400 }
      );
    }

    /** =============================
     *  1. Despesas Gerais
     * ============================= */
    let generalExpenses: GeneralExpenseItem[] = [];
    if (isVitor) {
      generalExpenses = await db.generalExpense.findMany({
        where: { monthReference: month, yearReference: year },
        select: {
          id: true,
          description: true,
          amount: true,
          dueDay: true,
          monthReference: true,
          yearReference: true,
          category: { select: { name: true } },
        },
      });
    }

    /** =============================
     *  2. Contas de Moradia
     * ============================= */
    let housingBills: HousingBillItem[] = [];
    if (isVitor) {
      housingBills = await db.housingBill.findMany({
        where: { monthReference: month, yearReference: year },
        select: {
          id: true,
          name: true,
          amount: true,
          dueDate: true,
          category: { select: { name: true } },
        },
      });
    }

    /** =============================
     *  3. Cartões + Transações
     * ============================= */
    const cards: CardItem[] = await db.card.findMany({
      select: { id: true, name: true, dueDay: true },
    });

    const transactions: TransactionItem[] = await db.transaction.findMany({
      where: { monthReference: month, yearReference: year },
      select: { id: true, cardId: true, amount: true },
    });

    /** =============================
     *  4. Normalização
     * ============================= */
    const normalizedGeneral = generalExpenses.map((g) => ({
      id: g.id,
      description: g.description ?? "Despesa Geral",
      date: new Date(
        Date.UTC(g.yearReference, g.monthReference - 1, g.dueDay)
      ).toISOString(),
      amount: g.amount,
      categoryName: g.category?.name ?? null,
    }));

    const normalizedHousing = housingBills.map((h) => ({
      id: h.id,
      description: h.name,
      date: h.dueDate.toISOString(),
      amount: h.amount,
      categoryName: h.category?.name ?? null,
    }));

    const normalizedCards = cards.map((c) => {
      const cardTransactions = transactions.filter((t) => t.cardId === c.id);
      const totalAmount = cardTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );
      const dueDate = new Date(Date.UTC(year, month - 1, c.dueDay));
      return {
        id: c.id,
        description: c.name,
        date: dueDate.toISOString(),
        amount: totalAmount,
        categoryName: null,
      };
    });

    /** =============================
     *  5. Monta resultado final
     * ============================= */
    const result = [
      ...normalizedCards,
      ...(isVitor ? normalizedGeneral : []),
      ...(isVitor ? normalizedHousing : []),
    ];

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Erro ao buscar vencimentos:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar vencimentos" },
      { status: 500 }
    );
  }
}
