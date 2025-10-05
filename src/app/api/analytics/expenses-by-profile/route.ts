// src/app/api/analytics/expenses-by-profile/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    // Garante que só usuários logados acessem
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (!month || !year || isNaN(month) || isNaN(year)) {
      return NextResponse.json(
        { error: "`month` e `year` são obrigatórios e devem ser números" },
        { status: 400 }
      );
    }

    // Agrupa transações do usuário logado por perfil
    const transactions = await db.transaction.groupBy({
      by: ["profileId"],
      where: {
        profile: { userId: user.id },
        monthReference: month,
        yearReference: year,
      },
      _sum: { amount: true },
    });

    // Busca perfis do usuário
    const profiles = await db.profile.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
    });

    // Monta o resultado
    const result = profiles.map((p) => {
      const data = transactions.find((t) => t.profileId === p.id);
      return {
        profileId: p.id,
        profileName: p.name,
        totalAmount: data?._sum.amount || 0,
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Erro ao calcular gastos por perfil:", error);
    return NextResponse.json(
      { error: "Erro interno ao calcular gastos" },
      { status: 500 }
    );
  }
}
