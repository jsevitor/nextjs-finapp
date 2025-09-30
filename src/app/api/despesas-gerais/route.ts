// src/app/api/despesas-gerais/route.ts
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { GeneralExpense, Category, Profile } from "@prisma/client";

type GeneralExpenseWhere = {
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

type GeneralExpenseWithIncludes = GeneralExpense & {
  category: Pick<Category, "id" | "name"> | null;
  profile: Pick<Profile, "id" | "name"> | null;
};

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

    const where: GeneralExpenseWhere = {
      monthReference,
      yearReference,
      userId: user.id,
    };

    const minValue = searchParams.get("minValue");
    const maxValue = searchParams.get("maxValue");
    const min = parseFloat(minValue || "");
    const max = parseFloat(maxValue || "");

    if (!isNaN(min) || !isNaN(max)) {
      where.amount = {};
      if (!isNaN(min)) where.amount.gte = min;
      if (!isNaN(max)) where.amount.lte = max;
    }

    const generalExpenses = await db.generalExpense.findMany({
      where,
      orderBy: { date: "asc" },
      include: {
        category: { select: { id: true, name: true } },
        profile: { select: { id: true, name: true } },
      },
    });

    const result = generalExpenses.map((ge) => ({
      id: ge.id,
      description: ge.description ?? null,
      business: ge.business ?? null,
      amount: Number(ge.amount),
      date: ge.date.toISOString(),
      dueDay: ge.dueDay,
      categoryId: ge.categoryId ?? null,
      profileId: ge.profileId ?? null,
      categoryName: ge.category?.name ?? null,
      profileName: ge.profile?.name ?? null,
      userId: ge.userId,
      monthReference: ge.monthReference,
      yearReference: ge.yearReference,
      installmentNumber: ge.installmentNumber ?? null,
      installmentTotal: ge.installmentTotal ?? null,
      parentId: ge.parentId ?? null,
      createdAt: ge.createdAt.toISOString(),
      updatedAt: ge.updatedAt.toISOString(),
    }));

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
    const expensesInput = Array.isArray(body) ? body : [body];

    const createdAll: GeneralExpenseWithIncludes[] = [];

    for (const exp of expensesInput) {
      const categoryId =
        exp.categoryId && exp.categoryId !== "" ? exp.categoryId : null;
      const profileId =
        exp.profileId && exp.profileId !== "" ? exp.profileId : null;

      let purchaseDate: Date;
      if (exp.date && typeof exp.date === "string") {
        if (/^\d{4}-\d{2}-\d{2}$/.test(exp.date)) {
          purchaseDate = new Date(exp.date + "T00:00:00Z");
        } else {
          purchaseDate = new Date(exp.date);
        }
      } else {
        purchaseDate = new Date();
      }
      if (isNaN(purchaseDate.getTime())) purchaseDate = new Date();

      const dueDay = exp.dueDay ?? purchaseDate.getUTCDate();
      const installmentTotal = Number(exp.installmentTotal) || 1;
      const parentId = randomUUID();

      const firstDueDate = new Date(
        Date.UTC(
          purchaseDate.getUTCFullYear(),
          purchaseDate.getUTCMonth(),
          dueDay
        )
      );

      if (purchaseDate.getUTCDate() > dueDay) {
        firstDueDate.setUTCMonth(firstDueDate.getUTCMonth() + 1);
      }

      const parcelsData = Array.from({ length: installmentTotal }, (_, i) => {
        const dueDate = new Date(
          Date.UTC(
            firstDueDate.getUTCFullYear(),
            firstDueDate.getUTCMonth() + i,
            dueDay
          )
        );

        return {
          id: i === 0 ? parentId : randomUUID(),
          description: exp.description ?? null,
          business: exp.business ?? null,
          amount: Number(exp.amount),
          date: purchaseDate,
          dueDay: dueDay,
          monthReference: dueDate.getUTCMonth() + 1,
          yearReference: dueDate.getUTCFullYear(),
          installmentNumber: i + 1,
          installmentTotal,
          parentId: i === 0 ? null : parentId,
          categoryId,
          profileId,
          userId: user.id,
        };
      });

      const created = await db.$transaction(
        parcelsData.map((p) =>
          db.generalExpense.create({
            data: p,
            include: {
              category: { select: { id: true, name: true } },
              profile: { select: { id: true, name: true } },
            },
          })
        )
      );

      createdAll.push(...created);
    }

    const result = createdAll.map((c) => ({
      id: c.id,
      description: c.description,
      business: c.business ?? null,
      amount: Number(c.amount),
      date: c.date.toISOString(),
      dueDay: c.dueDay,
      installmentNumber: c.installmentNumber ?? null,
      installmentTotal: c.installmentTotal ?? null,
      parentId: c.parentId ?? null,
      categoryId: c.categoryId ?? null,
      profileId: c.profileId ?? null,
      categoryName: c.category?.name ?? null,
      profileName: c.profile?.name ?? null,
      userId: c.userId,
      monthReference: c.monthReference,
      yearReference: c.yearReference,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("❌ Erro ao criar despesa(s) geral(is):", error);
    return NextResponse.json(
      { error: "Erro ao criar despesa geral" },
      { status: 500 }
    );
  }
}
