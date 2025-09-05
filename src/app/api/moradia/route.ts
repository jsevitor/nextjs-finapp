import { db } from "@/lib/prisma";
import { isAuthorized } from "@/lib/authorized";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await isAuthorized(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const bills = await db.housingBill.findMany({
      orderBy: { dueDate: "asc" },
    });
    return NextResponse.json(bills);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar contas de moradia" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, amount, dueDate } = body;

    if (!name || !amount || dueDate == null) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const bill = await db.housingBill.create({
      data: {
        name,
        amount,
        dueDate,
        appUserId: user.id,
      },
    });
    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar conta de moradia" },
      { status: 500 }
    );
  }
}
