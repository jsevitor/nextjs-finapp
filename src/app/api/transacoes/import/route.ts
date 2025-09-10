// src/app/api/transacoes/import/route.ts
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "O JSON deve ser um array de transações" },
        { status: 400 }
      );
    }

    // Busca o primeiro cartão e perfil do usuário
    const [defaultCard] = await db.card.findMany({
      where: { userId: user.id },
      take: 1,
    });

    const [defaultProfile] = await db.profile.findMany({
      where: { userId: user.id },
      take: 1,
    });

    const [defaultCategory] = await db.category.findMany({
      where: { userId: user.id },
      take: 1,
    });

    if (!defaultCard || !defaultProfile) {
      return NextResponse.json(
        {
          error: "Usuário precisa ter ao menos 1 cartão e 1 perfil cadastrados",
        },
        { status: 400 }
      );
    }

    // Busca todas as categorias do usuário
    const categorias = await db.category.findMany({
      where: { userId: user.id },
    });

    const mapaCategorias = new Map(
      categorias.map((cat) => [cat.name.toLowerCase(), cat.id])
    );

    // Valida se alguma categoria é inválida
    const nomesInvalidos: string[] = [];

    const transacoes = body.map((t: any, idx: number) => {
      let categoriaId: string | undefined;

      if (t.categoryId) {
        categoriaId = t.categoryId;
      } else if (t.categoryName) {
        const nomeNormalizado = t.categoryName.trim().toLowerCase();
        categoriaId = mapaCategorias.get(nomeNormalizado);
      }

      // Se ainda não tiver uma categoria válida, usa a padrão
      if (!categoriaId) {
        categoriaId = defaultCategory.id;
      }

      const dataTransacao = new Date(t.date);
      const monthReference = dataTransacao.getMonth() + 2;
      const yearReference = dataTransacao.getFullYear();

      return {
        date: dataTransacao,
        business: t.business || null,
        description: t.description || `Importado #${idx + 1}`,
        amount: Number(t.amount),
        cardId: t.cardId || defaultCard.id,
        profileId: t.profileId || defaultProfile.id,
        categoryId: categoriaId,
        installmentNumber: t.installmentNumber || 1,
        installmentTotal: t.installmentTotal || 1,
        parentId: t.parentId || null,
        monthReference,
        yearReference,
      };
    });

    if (nomesInvalidos.length > 0) {
      return NextResponse.json(
        {
          error: "Categorias inválidas detectadas",
          categoriasInvalidas: [...new Set(nomesInvalidos)],
        },
        { status: 400 }
      );
    }

    const created = await db.transaction.createMany({
      data: transacoes,
    });

    return NextResponse.json(
      { message: "Importação concluída", count: created.count },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao importar transações:", error);
    return NextResponse.json(
      { error: "Erro ao importar transações" },
      { status: 500 }
    );
  }
}
