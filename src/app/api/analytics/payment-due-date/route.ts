import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (!month || !year) {
      return NextResponse.json(
        { error: "month e year são obrigatórios" },
        { status: 400 }
      );
    }

    // General Expenses
    const general = await db.generalExpense.findMany({
      where: {
        monthReference: month,
        yearReference: year,
      },
      select: {
        id: true,
        description: true,
        amount: true,
        dueDate: true,
        category: { select: { name: true } },
      },
    });

    // Housing Bills
    const housing = await db.housingBill.findMany({
      where: {
        monthReference: month,
        yearReference: year,
      },
      select: {
        id: true,
        name: true,
        amount: true,
        dueDate: true,
        category: { select: { name: true } },
      },
    });

    // Normaliza
    const result = [
      ...general.map((g) => ({
        id: g.id,
        description: g.description ?? "Despesa Geral",
        dueDate: g.dueDate,
        amount: g.amount,
        categoryName: g.category?.name ?? null,
      })),
      ...housing.map((h) => ({
        id: h.id,
        description: h.name,
        dueDate: h.dueDate,
        amount: h.amount,
        categoryName: h.category?.name ?? null,
      })),
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
