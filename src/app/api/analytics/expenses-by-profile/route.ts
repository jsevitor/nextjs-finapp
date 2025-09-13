// src/app/api/analytics/expenses-by-profile/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (!month || !year) {
      return NextResponse.json(
        { error: "month e year são obrigatórios" },
        { status: 400 }
      );
    }

    // Agrupar transações do perfil filtrado por mês/ano
    const transactions = await db.transaction.groupBy({
      by: ["profileId"],
      where: {
        profile: { userId: user.id },
        monthReference: month,
        yearReference: year,
      },
      _sum: { amount: true },
    });

    const profiles = await db.profile.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
    });

    const result = profiles.map((p) => {
      const data = transactions.find((t) => t.profileId === p.id);
      return {
        profileId: p.id,
        profileName: p.name,
        totalAmount: data?._sum.amount || 0,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao calcular gastos por perfil:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
