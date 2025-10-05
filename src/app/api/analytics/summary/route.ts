// src/app/api/analytics/summary/route.ts
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

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  const startCurrent = new Date(year, month - 1, 1);
  const endCurrent = new Date(year, month, 1);

  // --- Transações ---
  const currentTransactions = await db.transaction.aggregate({
    where: { monthReference: month, yearReference: year },
    _sum: { amount: true },
  });

  const prevTransactions = await db.transaction.aggregate({
    where: { monthReference: prevMonth, yearReference: prevYear },
    _sum: { amount: true },
  });

  const transactionsTotal = currentTransactions._sum.amount || 0;
  const transactionsPrev = prevTransactions._sum.amount || 0;
  const transactionsVariation =
    transactionsPrev > 0
      ? ((transactionsTotal - transactionsPrev) / transactionsPrev) * 100
      : 0;

  // --- Gastos Moradia ---
  const currentHousing = await db.housingBill.aggregate({
    where: { dueDate: { gte: startCurrent, lt: endCurrent } },
    _sum: { amount: true },
  });

  const housingTotal = currentHousing._sum.amount || 0;

  // --- Top 3 gastos do mês/ano ---
  const topTransactions = await db.transaction.findMany({
    where: { monthReference: month, yearReference: year },
    orderBy: { amount: "desc" },
    take: 3,
  });

  // --- Summary por perfil filtrado pelo mês/ano ---
  const summaryByProfileRaw = await db.transaction.groupBy({
    by: ["profileId"],
    _sum: { amount: true },
    where: { monthReference: month, yearReference: year }, // 🔹 aqui
  });

  // Pega os perfis
  const profiles = await db.profile.findMany({
    select: { id: true, name: true },
  });

  const summaryByProfile = summaryByProfileRaw.map((s) => ({
    id: s.profileId,
    name: profiles.find((p) => p.id === s.profileId)?.name || "Desconhecido",
    total: s._sum.amount || 0,
  }));

  return NextResponse.json({
    transactionsTotal,
    transactionsPrev,
    transactionsVariation,
    housingTotal,
    topTransactions: topTransactions.map((t) => ({
      description: t.description,
      amount: t.amount,
    })),
    summaryByProfile, // 🔹 total do mês/ano correto
  });
}
