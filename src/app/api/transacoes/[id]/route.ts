// src/app/api/transacoes/[id]/route.ts
import { db } from "@/lib/prisma";
import { isAuthorized } from "@/lib/authorized";
import { NextRequest, NextResponse } from "next/server";
import { RouteContext } from "@/types/route-context";

export async function PUT(req: NextRequest, context: RouteContext) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

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

  if (!date || !amount || !cardId || !profileId || !categoryId) {
    return NextResponse.json(
      {
        error:
          "Data, valor, cartão, perfil e categoria são obrigatórios para atualizar a transação.",
      },
      { status: 400 }
    );
  }

  try {
    const updated = await db.transaction.update({
      where: { id },
      data: {
        date: new Date(date),
        business: business || null,
        description: description || null,
        amount: Number(amount),
        cardId,
        profileId,
        categoryId,
        installmentNumber: installmentNumber || null,
        installmentTotal: installmentTotal || null,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar transação" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  try {
    await db.transaction.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Transação deletada com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    return NextResponse.json(
      { error: "Erro ao deletar transação" },
      { status: 500 }
    );
  }
}
