import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const transactions = await db.transaction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        profile: true,
        card: true,
      },
    });

    return NextResponse.json(transactions, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar transações" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      date,
      business,
      description,
      amount,
      cardId,
      profileId,
      categoryId,
      installmentNumber,
      installmentTotal,
      parentId,
    } = body;

    // Validação básica
    if (!date || !amount || !cardId || !profileId || !categoryId) {
      return NextResponse.json(
        {
          error: "Data, valor, cartão, perfil e categoria são obrigatórios.",
        },
        { status: 400 }
      );
    }

    const transaction = await db.transaction.create({
      data: {
        date: new Date(date),
        business,
        description,
        amount,
        cardId,
        profileId,
        categoryId,
        installmentNumber,
        installmentTotal,
        parentId,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return NextResponse.json(
      { error: "Erro ao criar transação" },
      { status: 500 }
    );
  }
}
