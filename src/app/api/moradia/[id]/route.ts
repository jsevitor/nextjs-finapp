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
  const { name, amount, dueDate } = body;

  try {
    const existing = await db.housingBill.findUnique({ where: { id } });

    const updated = await db.housingBill.update({
      where: { id },
      data: { name, amount, dueDate },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar conta" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, conext: RouteContext) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await conext.params;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  try {
    const existing = await db.housingBill.findUnique({ where: { id } });

    await db.housingBill.delete({ where: { id } });
    return NextResponse.json(
      { message: "Conta deletada com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao deletar conta" },
      { status: 500 }
    );
  }
}
