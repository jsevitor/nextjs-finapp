// src/app/api/analytics/expenses-by-period/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get("year"));

    if (!year) {
      return NextResponse.json(
        { error: "year é obrigatório" },
        { status: 400 }
      );
    }

    const transactions = await db.transaction.groupBy({
      by: ["monthReference"],
      where: {
        yearReference: year,
      },
      _sum: { amount: true },
    });

    const months = Array.from({ length: 12 }, (_, i) => {
      const data = transactions.find((t) => t.monthReference === i + 1);
      return {
        month: i + 1,
        totalAmount: data?._sum.amount || 0,
      };
    });

    return NextResponse.json({
      year,
      data: months,
    });
  } catch (error) {
    console.error("Erro ao calcular gastos por período:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
