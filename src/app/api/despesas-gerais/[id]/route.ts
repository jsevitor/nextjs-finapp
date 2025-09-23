// app/api/despesas-gerais/[id]/route.ts
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { RouteContext } from "@/types/route-context";

export async function PUT(req: NextRequest, conext: RouteContext) {
  const user = await getCurrentUser();
  if (!user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = await conext.params;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) return NextResponse.json({ error: "ID inválido." }, { status: 400 });

  try {
    type ExpenseUpdateBody = {
      description?: string;
      amount: number;
      dueDate: string;
      categoryId?: string;
      profileId?: string;
    };

    const body: ExpenseUpdateBody = await req.json();
    const { description, amount, dueDate, categoryId, profileId } = body;

    if (!amount || !dueDate) {
      return NextResponse.json(
        { error: "Valor e data de vencimento são obrigatórios." },
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

    const parsedDate = new Date(dueDate);
    const monthReference = parsedDate.getMonth() + 1;
    const yearReference = parsedDate.getFullYear();

    const updatedExpense = await db.generalExpense.update({
      where: { id },
      data: {
        description: description ?? existingExpense.description,
        amount: Number(amount),
        dueDate: parsedDate,
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
        dueDate: updatedExpense.dueDate.toISOString(),
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
  if (!user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const params = await conext.params;
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const existingExpense = await db.generalExpense.findFirst({
      where: { id, userId: user.id },
    });
    if (!existingExpense)
      return NextResponse.json(
        { error: "Despesa não encontrada ou não autorizada." },
        { status: 403 }
      );

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
