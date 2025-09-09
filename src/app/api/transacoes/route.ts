// app/api/transacoes/route.ts - API CORRIGIDA
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

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
    const cardId = searchParams.get("card"); // agora opcional
    const categoryId = searchParams.get("category");
    const minValue = searchParams.get("minValue");
    const maxValue = searchParams.get("maxValue");

    // Construir cláusula where
    const where: any = {
      monthReference,
      yearReference,
      card: {
        userId: user.id, // garante que só veja as transações do próprio usuário
      },
    };

    if (cardId) {
      where.cardId = cardId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minValue || maxValue) {
      where.amount = {};
      if (minValue) where.amount.gte = parseFloat(minValue);
      if (maxValue) where.amount.lte = parseFloat(maxValue);
    }

    console.log("🔍 Buscando transações com filtros:", where);

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
      installmentNumber = 1,
      installmentTotal = 1,
      parentId,
    } = body;

    // Validação
    if (!date || !amount || !cardId || !profileId || !categoryId) {
      return NextResponse.json(
        { error: "Data, valor, cartão, perfil e categoria são obrigatórios." },
        { status: 400 }
      );
    }

    // Verificar se o cartão pertence ao usuário
    const card = await db.card.findFirst({
      where: { id: cardId, userId: user.id },
    });

    if (!card) {
      return NextResponse.json(
        { error: "Cartão não encontrado ou não autorizado" },
        { status: 403 }
      );
    }

    const parsedDate = new Date(date);
    const monthReference = parsedDate.getMonth() + 2;
    const yearReference = parsedDate.getFullYear();

    const transaction = await db.transaction.create({
      data: {
        date: parsedDate,
        business: business || null,
        description: description || null,
        amount: Number(amount),
        cardId,
        profileId,
        categoryId,
        installmentNumber: installmentNumber || 1,
        installmentTotal: installmentTotal || 1,
        parentId: parentId || null,
        monthReference,
        yearReference,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
        profile: {
          select: { id: true, name: true },
        },
        card: {
          select: { id: true, name: true },
        },
      },
    });

    const result = {
      id: transaction.id,
      date: transaction.date.toISOString(),
      business: transaction.business,
      description: transaction.description,
      amount: Number(transaction.amount),
      cardId: transaction.cardId,
      profileId: transaction.profileId,
      categoryId: transaction.categoryId,
      installmentNumber: transaction.installmentNumber,
      installmentTotal: transaction.installmentTotal,
      parentId: transaction.parentId,
      monthReference: transaction.monthReference,
      yearReference: transaction.yearReference,
      categoryName: transaction.category?.name,
      cardName: transaction.card?.name,
      profileName: transaction.profile?.name,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("❌ Erro ao criar transação:", error);
    return NextResponse.json(
      { error: "Erro ao criar transação" },
      { status: 500 }
    );
  }
}
