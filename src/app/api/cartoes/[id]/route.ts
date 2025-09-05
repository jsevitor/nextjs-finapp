import { db } from "@/lib/prisma";
import { isAuthorized } from "@/lib/authorized";
import { NextRequest, NextResponse } from "next/server";
import { RouteContext } from "@/types/route-context";

export async function PUT(req: NextRequest, conext: RouteContext) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await conext.params;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const body = await req.json();
  const { name, closingDate, dueDay } = body;

  try {
    const card = await db.card.update({
      where: { id },
      data: { name, closingDate, dueDay },
    });
    return NextResponse.json(card, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar cartão:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cartão" },
      { status: 500 }
    );
  }
}
