// src/app/api/transacoes/route.ts
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

// Definir um tipo para o objeto 'where' que será passado para a consulta
interface TransactionWhere {
  monthReference: number;
  yearReference: number;
  card?: { userId: string };
  cardId?: string;
  categoryId?: string;
  amount?: { gte?: number; lte?: number };
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // Parâmetros obrigatórios (mês e ano)
    const monthReference = parseInt(
      searchParams.get("monthReference") || "0",
      10
    );
    const yearReference = parseInt(
      searchParams.get("yearReference") || "0",
      10
    );

    if (!monthReference || !yearReference) {
      return NextResponse.json(
        { error: "Mês e ano são obrigatórios" },
        { status: 400 }
      );
    }

    // Filtros opcionais
    const cardId = searchParams.get("card");
    const categoryId = searchParams.get("category");
    const minValue = searchParams.get("minValue");
    const maxValue = searchParams.get("maxValue");

    // Construir cláusula where com o tipo TransactionWhere
    const where: TransactionWhere = {
      monthReference,
      yearReference,
      card: {
        userId: user.id,
      },
    };

    if (cardId) {
      where.cardId = cardId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Validar valores numéricos antes de adicionar no filtro
    const amount: { gte?: number; lte?: number } = {};
    if (minValue && !isNaN(Number(minValue))) {
      amount.gte = Number(minValue);
    }
    if (maxValue && !isNaN(Number(maxValue))) {
      amount.lte = Number(maxValue);
    }
    if (Object.keys(amount).length > 0) {
      where.amount = amount;
    }

    // Buscar transações
    const transactions = await db.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        profile: { select: { id: true, name: true } },
        card: { select: { id: true, name: true } },
      },
    });

    // Normalizar resposta
    const result = transactions.map((t) => ({
      id: t.id,
      date: t.date.toISOString(),
      business: t.business,
      description: t.description,
      amount: Number(t.amount),
      cardId: t.cardId,
      profileId: t.profileId,
      categoryId: t.categoryId,
      installmentNumber: t.installmentNumber,
      installmentTotal: t.installmentTotal,
      parentId: t.parentId,
      monthReference: t.monthReference,
      yearReference: t.yearReference,
      categoryName: t.category?.name,
      cardName: t.card?.name,
      profileName: t.profile?.name,
    }));

    console.log(`✅ Encontradas ${result.length} transações`);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Erro ao buscar transações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      monthReference,
      yearReference,
    } = body;

    const newTransaction = await db.transaction.create({
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
        monthReference,
        yearReference,
      },
      include: {
        category: { select: { id: true, name: true } },
        profile: { select: { id: true, name: true } },
        card: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("❌ Erro ao adicionar transação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
