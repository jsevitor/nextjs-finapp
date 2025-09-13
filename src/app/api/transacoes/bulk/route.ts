// src/app/api/transacoes/bulk/route.ts
import { db } from "@/lib/prisma";
import { isAuthorized } from "@/lib/authorized";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Lista de IDs é obrigatória" },
        { status: 400 }
      );
    }

    const result = await db.transaction.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json(
      { message: "Transações deletadas", count: result.count },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erro no bulk delete:", error);
    return NextResponse.json(
      { error: "Erro ao deletar transações" },
      { status: 500 }
    );
  }
}
