// app/api/moradia/[id]/route.ts
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, amount, dueDate, categoryId, profileId } = body;
    const { id } = params;

    if (!name || !amount || !dueDate) {
      return NextResponse.json(
        { error: "Nome, valor e data de vencimento são obrigatórios." },
        { status: 400 }
      );
    }

    const existingBill = await db.housingBill.findFirst({
      where: { id, userId: user.id },
    });
    if (!existingBill)
      return NextResponse.json(
        { error: "Conta de moradia não encontrada ou não autorizada." },
        { status: 403 }
      );

    const parsedDate = new Date(dueDate);
    const monthReference = parsedDate.getMonth() + 1;
    const yearReference = parsedDate.getFullYear();

    const updatedBill = await db.housingBill.update({
      where: { id },
      data: {
        name,
        amount: Number(amount),
        dueDate: parsedDate,
        categoryId: categoryId ?? existingBill.categoryId,
        profileId: profileId ?? existingBill.profileId,
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
        ...updatedBill,
        dueDate: updatedBill.dueDate.toISOString(),
        categoryName: updatedBill.category?.name ?? null,
        profileName: updatedBill.profile?.name ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erro ao atualizar conta de moradia:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar conta de moradia" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = params;

    const existingBill = await db.housingBill.findFirst({
      where: { id, userId: user.id },
    });
    if (!existingBill)
      return NextResponse.json(
        { error: "Conta de moradia não encontrada ou não autorizada." },
        { status: 403 }
      );

    await db.housingBill.delete({ where: { id } });

    return NextResponse.json(
      { message: "Conta de moradia removida com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erro ao remover conta de moradia:", error);
    return NextResponse.json(
      { error: "Erro ao remover conta de moradia" },
      { status: 500 }
    );
  }
}
