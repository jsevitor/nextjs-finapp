// src/app/api/analytics/payment-due-date/route.ts
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
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
     *  1. Despesas Gerais (com dueDay)
     * ============================= */
    const generalExpenses = await db.generalExpense.findMany({
      where: {
        monthReference: month,
        yearReference: year,
      },
      select: {
        id: true,
        description: true,
        amount: true,
        dueDay: true,
        monthReference: true,
        yearReference: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    /** =============================
     *  2. Contas de Moradia
     * ============================= */
    const housingBills = await db.housingBill.findMany({
      where: {
        monthReference: month,
        yearReference: year,
      },
      select: {
        id: true,
        name: true,
        amount: true,
        dueDate: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    /** =============================
     *  3. Cartões + Transações
     * ============================= */
    const cards = await db.card.findMany({
      select: {
        id: true,
        name: true,
        dueDay: true,
      },
    });

    const transactions = await db.transaction.findMany({
      where: {
        monthReference: month,
        yearReference: year,
      },
      select: {
        id: true,
        cardId: true,
        amount: true,
      },
    });

    /** =============================
     *  4. Normalização
     * ============================= */

    // Para despesas gerais: usa dueDay + monthReference/ yearReference para vencimento
    const normalizedGeneral = generalExpenses.map((g) => {
      // Calcula data de vencimento em UTC para evitar deslocamento de mês
      const dueDate = new Date(
        Date.UTC(g.yearReference, g.monthReference - 1, g.dueDay)
      );

      return {
        id: g.id,
        description: g.description ?? "Despesa Geral",
        date: dueDate.toISOString(), // agora “date” = vencimento calculado
        amount: g.amount,
        categoryName: g.category?.name ?? null,
      };
    });

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

      // Vencimento do cartão no mês de referência, no dia do dueDay
      const dueDate = new Date(Date.UTC(year, month - 1, c.dueDay));

      return {
        id: c.id,
        description: c.name,
        date: dueDate.toISOString(),
        amount: totalAmount,
        categoryName: null,
      };
    });

    const result = [
      ...normalizedGeneral,
      ...normalizedHousing,
      ...normalizedCards,
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
