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
    const profile = await db.profile.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
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
    const profile = await db.profile.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Perfil deletado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao deletar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao deletar perfil" },
      { status: 500 }
    );
  }
}
