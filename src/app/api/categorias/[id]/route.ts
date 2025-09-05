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
  const { name } = body;

  try {
    const category = await db.category.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
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
    const category = await db.category.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Categoria deletada com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao deletar categoria" },
      { status: 500 }
    );
  }
}
