// app/api/analytics/spending-by-category/route.ts
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));

  if (!month || !year) {
    return NextResponse.json(
      { error: "month e year são obrigatórios" },
      { status: 400 }
    );
  }

  // Transações
  const transactions = await db.transaction.groupBy({
    by: ["categoryId"],
    where: { monthReference: month, yearReference: year },
    _sum: { amount: true },
  });

  // Despesas gerais
  const general = await db.generalExpense.groupBy({
    by: ["categoryId"],
    where: { monthReference: month, yearReference: year },
    _sum: { amount: true },
  });

  // Moradia
  const housing = await db.housingBill.groupBy({
    by: ["categoryId"],
    where: { monthReference: month, yearReference: year },
    _sum: { amount: true },
  });

  // Junta tudo
  const merged: Record<string, number> = {};
  [...transactions, ...general, ...housing].forEach((item) => {
    const id = item.categoryId || "sem-categoria";
    merged[id] = (merged[id] || 0) + (item._sum.amount || 0);
  });

  // Retorna com nome
  const categories = await db.category.findMany({
    where: {
      id: { in: Object.keys(merged).filter((id) => id !== "sem-categoria") },
    },
  });

  const result = Object.entries(merged).map(([id, total]) => {
    const cat = categories.find((c) => c.id === id);
    return {
      categoryId: id,
      categoryName: cat?.name ?? "Sem categoria",
      total,
    };
  });

  return NextResponse.json(result);
}
