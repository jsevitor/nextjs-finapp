import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const cards = await db.card.findMany({
      orderBy: { createdAt: "desc" },
    });
    return new NextResponse(JSON.stringify(cards), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar cartões:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cartões" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, closingDate, dueDay } = body;

    if (!name || !closingDate || !dueDay) {
      return NextResponse.json(
        {
          error:
            "O nome, dia de fechamento e dia de vencimento são obrigatórios",
        },
        { status: 400 }
      );
    }

    const card = await db.card.create({
      data: {
        name,
        closingDate,
        dueDay,
        userId: user.id,
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao criar categoria" },
      { status: 500 }
    );
  }
}
