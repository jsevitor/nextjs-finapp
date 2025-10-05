// src/app/api/transacoes/route.ts
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

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

    const cardId = searchParams.get("card");
    const categoryId = searchParams.get("category");
    const minValue = searchParams.get("minValue");
    const maxValue = searchParams.get("maxValue");

    const where: TransactionWhere = {
      monthReference,
      yearReference,
      // card: { userId: user.id },
    };

    if (cardId) where.cardId = cardId;
    if (categoryId) where.categoryId = categoryId;

    const amount: { gte?: number; lte?: number } = {};
    if (minValue && !isNaN(Number(minValue))) amount.gte = Number(minValue);
    if (maxValue && !isNaN(Number(maxValue))) amount.lte = Number(maxValue);
    if (Object.keys(amount).length > 0) where.amount = amount;

    const transactions = await db.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        profile: { select: { id: true, name: true } },
        card: { select: { id: true, name: true } },
      },
    });

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
      installmentTotal = 1,
      monthReference,
      yearReference,
    } = body;

    let purchaseDate: Date;
    if (date && typeof date === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        purchaseDate = new Date(date + "T00:00:00Z");
      } else {
        purchaseDate = new Date(date);
      }
    } else {
      purchaseDate = new Date();
    }
    if (isNaN(purchaseDate.getTime())) purchaseDate = new Date();

    const totalParcels = Number(installmentTotal) || 1;
    const parcelAmount = Number(amount); // você pode dividir o valor se quiser parcelas fracionadas
    const parentId = randomUUID();

    function addMonthsToYearMonth(month: number, year: number, offset: number) {
      const date = new Date(Date.UTC(year, month - 1 + offset));
      return {
        monthReference: date.getUTCMonth() + 1,
        yearReference: date.getUTCFullYear(),
      };
    }

    const parcelsData = Array.from({ length: totalParcels }, (_, i) => {
      const { monthReference: mRef, yearReference: yRef } =
        addMonthsToYearMonth(monthReference, yearReference, i);

      return {
        id: i === 0 ? parentId : randomUUID(),
        business: business ?? null,
        description: description ?? null,
        amount: parcelAmount,
        cardId,
        profileId,
        categoryId,
        date: purchaseDate, // mesma data para todas
        monthReference: mRef,
        yearReference: yRef,
        installmentNumber: i + 1,
        installmentTotal: totalParcels,
        parentId: i === 0 ? null : parentId,
      };
    });

    const created = await db.$transaction(
      parcelsData.map((p) =>
        db.transaction.create({
          data: p,
          include: {
            category: { select: { id: true, name: true } },
            profile: { select: { id: true, name: true } },
            card: { select: { id: true, name: true } },
          },
        })
      )
    );

    const result = created.map((t) => ({
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

    console.log(`✅ Criadas ${result.length} transações parceladas`);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("❌ Erro ao adicionar transação:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar transação" },
      { status: 500 }
    );
  }
}
