// app/api/despesas-gerais/route.ts
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
    const categoryId = searchParams.get("category");
    const profileId = searchParams.get("profile");
    const minValue = searchParams.get("minValue");
    const maxValue = searchParams.get("maxValue");

    // Construir cláusula where
    const where: any = {
      monthReference,
      yearReference,
      userId: user.id,
    };

    if (categoryId) where.categoryId = categoryId;
    if (profileId) where.profileId = profileId;
    if (minValue || maxValue) {
      where.amount = {};
      if (minValue) where.amount.gte = parseFloat(minValue);
      if (maxValue) where.amount.lte = parseFloat(maxValue);
    }

    console.log("🔍 Buscando despesas gerais com filtros:", where);

    const generalExpenses = await db.generalExpense.findMany({
      where,
      orderBy: { dueDate: "asc" },
      include: {
        category: { select: { id: true, name: true } },
        profile: { select: { id: true, name: true } },
      },
    });

    const result = generalExpenses.map((ge) => ({
      id: ge.id,
      description: ge.description,
      amount: Number(ge.amount),
      dueDate: ge.dueDate,
      categoryId: ge.categoryId,
      profileId: ge.profileId,
      categoryName: ge.category?.name || null,
      profileName: ge.profile?.name || null,
      userId: ge.userId,
      monthReference: ge.monthReference,
      yearReference: ge.yearReference,
    }));

    console.log(`✅ Encontradas ${result.length} despesas gerais`);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Erro ao buscar despesas gerais:", error);
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
    const { description, amount, dueDate, categoryId, profileId } = body;

    if (!amount || !dueDate) {
      return NextResponse.json(
        { error: "Valor e data de vencimento são obrigatórios." },
        { status: 400 }
      );
    }

    const parsedDate = new Date(dueDate);
    const monthReference = parsedDate.getMonth() + 1;
    const yearReference = parsedDate.getFullYear();

    const expense = await db.generalExpense.create({
      data: {
        description: description || null,
        amount: Number(amount),
        dueDate: new Date(dueDate),
        categoryId: categoryId || null,
        profileId: profileId || null,
        userId: user.id,
        monthReference: monthReference,
        yearReference: yearReference,
      },
      include: {
        category: { select: { id: true, name: true } },
        profile: { select: { id: true, name: true } },
      },
    });

    const result = {
      id: expense.id,
      description: expense.description,
      amount: Number(expense.amount),
      dueDate: expense.dueDate.toISOString(),
      categoryId: expense.categoryId,
      profileId: expense.profileId,
      categoryName: expense.category?.name ?? null,
      profileName: expense.profile?.name ?? null,
      userId: expense.userId,
      monthReference: expense.monthReference,
      yearReference: expense.yearReference,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("❌ Erro ao criar despesa geral:", error);
    return NextResponse.json(
      { error: "Erro ao criar despesa geral" },
      { status: 500 }
    );
  }
}
