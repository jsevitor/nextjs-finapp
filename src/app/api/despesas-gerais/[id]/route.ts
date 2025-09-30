// app/api/despesas-gerais/[id]/route.ts
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { RouteContext } from "@/types/route-context";

export async function PUT(req: NextRequest, conext: RouteContext) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await conext.params;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    type ExpenseUpdateBody = {
      description?: string;
      amount: number;
      date: string; // Data da compra
      dueDay?: number; // Dia do vencimento
      categoryId?: string;
      profileId?: string;
      business?: string;
    };

    const body: ExpenseUpdateBody = await req.json();
    const {
      description,
      amount,
      date,
      dueDay,
      categoryId,
      profileId,
      business,
    } = body;

    if (amount === undefined || !date) {
      return NextResponse.json(
        { error: "Valor e data da compra são obrigatórios." },
        { status: 400 }
      );
    }

    const existingExpense = await db.generalExpense.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingExpense) {
      return NextResponse.json(
        { error: "Despesa não encontrada ou não autorizada." },
        { status: 403 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Data inválida." }, { status: 400 });
    }

    // Usa o dueDay passado ou o existente, ou o dia da data da compra
    const parsedDueDay =
      dueDay ?? existingExpense.dueDay ?? parsedDate.getUTCDate();
    const monthReference = parsedDate.getUTCMonth() + 1;
    const yearReference = parsedDate.getUTCFullYear();

    const updatedExpense = await db.generalExpense.update({
      where: { id },
      data: {
        description: description ?? existingExpense.description,
        amount: Number(amount),
        date: parsedDate,
        dueDay: parsedDueDay,
        business: business ?? existingExpense.business,
        categoryId: categoryId ?? existingExpense.categoryId,
        profileId: profileId ?? existingExpense.profileId,
        monthReference,
        yearReference,
      },
      include: {
        category: { select: { id: true, name: true } },
        profile: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      {
        ...updatedExpense,
        date: updatedExpense.date.toISOString(),
        categoryName: updatedExpense.category?.name ?? null,
        profileName: updatedExpense.profile?.name ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erro ao atualizar despesa geral:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar despesa geral" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, conext: RouteContext) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await conext.params;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    const existingExpense = await db.generalExpense.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingExpense) {
      return NextResponse.json(
        { error: "Despesa não encontrada ou não autorizada." },
        { status: 403 }
      );
    }

    await db.generalExpense.delete({ where: { id } });

    return NextResponse.json(
      { message: "Despesa geral removida com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erro ao remover despesa geral:", error);
    return NextResponse.json(
      { error: "Erro ao remover despesa geral" },
      { status: 500 }
    );
  }
}
