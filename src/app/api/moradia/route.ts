// app/api/moradia/route.ts
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

// Definindo o tipo de filtro para a variável 'where'
type HousingBillWhere = {
  monthReference: number;
  yearReference: number;
  userId: string;
  categoryId?: string;
  profileId?: string;
  amount?: {
    gte?: number;
    lte?: number;
  };
};

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    const categoryId = searchParams.get("category");
    const profileId = searchParams.get("profile");
    const minValue = searchParams.get("minValue");
    const maxValue = searchParams.get("maxValue");

    // Usando o tipo HousingBillWhere para a variável 'where'
    const where: HousingBillWhere = {
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

    const bills = await db.housingBill.findMany({
      where,
      orderBy: { dueDate: "asc" },
      include: {
        category: { select: { id: true, name: true } },
        profile: { select: { id: true, name: true } },
      },
    });

    const result = bills.map((b) => ({
      id: b.id,
      name: b.name,
      amount: Number(b.amount),
      dueDate: b.dueDate,
      categoryId: b.categoryId,
      profileId: b.profileId,
      categoryName: b.category?.name ?? null,
      profileName: b.profile?.name ?? null,
      userId: b.userId,
      monthReference: b.monthReference,
      yearReference: b.yearReference,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Erro ao buscar contas de moradia:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, amount, dueDate, categoryId, profileId } = body;

    if (!name || !amount || !dueDate) {
      return NextResponse.json(
        { error: "Nome, valor e data de vencimento são obrigatórios." },
        { status: 400 }
      );
    }

    const parsedDate = new Date(dueDate);
    const monthReference = parsedDate.getMonth() + 1;
    const yearReference = parsedDate.getFullYear();

    const bill = await db.housingBill.create({
      data: {
        name,
        amount: Number(amount),
        dueDate: parsedDate,
        categoryId: categoryId || null,
        profileId: profileId || null,
        userId: user.id,
        monthReference,
        yearReference,
      },
      include: {
        category: { select: { id: true, name: true } },
        profile: { select: { id: true, name: true } },
      },
    });

    const result = {
      id: bill.id,
      name: bill.name,
      amount: Number(bill.amount),
      dueDate: bill.dueDate.toISOString(),
      categoryId: bill.categoryId,
      profileId: bill.profileId,
      categoryName: bill.category?.name ?? null,
      profileName: bill.profile?.name ?? null,
      userId: bill.userId,
      monthReference: bill.monthReference,
      yearReference: bill.yearReference,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("❌ Erro ao criar conta de moradia:", error);
    return NextResponse.json(
      { error: "Erro ao criar conta de moradia" },
      { status: 500 }
    );
  }
}
