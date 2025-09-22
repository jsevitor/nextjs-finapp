// src/app/api/transacoes/import/route.ts
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

// Definindo uma interface para os dados de cada transação
interface ImportTransaction {
  date: string; // Formato de data (ISO string ou similar)
  business?: string;
  description?: string;
  amount: number;
  cardId?: string;
  profileId?: string;
  categoryId?: string;
  categoryName?: string;
  installmentNumber?: number;
  installmentTotal?: number;
  parentId?: string;
  monthReference?: number;
  yearReference?: number;
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: ImportTransaction[] = await req.json(); // Usando o tipo ImportTransaction

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "O JSON deve ser um array de transações" },
        { status: 400 }
      );
    }

    // Busca recursos obrigatórios
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

    if (!defaultCard || !defaultProfile || !defaultCategory) {
      return NextResponse.json(
        {
          error:
            "Usuário precisa ter ao menos 1 cartão, 1 perfil e 1 categoria cadastrados",
        },
        { status: 400 }
      );
    }

    // Mapa de categorias do usuário
    const categorias = await db.category.findMany({
      where: { userId: user.id },
    });
    const mapaCategorias = new Map(
      categorias.map((cat) => [cat.name.toLowerCase(), cat.id])
    );

    const transacoes = body.map((t, idx) => {
      let categoriaId: string | undefined;

      if (t.categoryId) {
        categoriaId = t.categoryId;
      } else if (t.categoryName) {
        const nomeNormalizado = t.categoryName.trim().toLowerCase();
        categoriaId = mapaCategorias.get(nomeNormalizado);
      }

      // Se não achar, usa categoria padrão
      if (!categoriaId) {
        categoriaId = defaultCategory.id;
      }

      const dataTransacao = new Date(t.date);

      let monthReference: number;
      let yearReference: number;

      if (t.monthReference && t.yearReference) {
        // Usa o que veio no JSON
        monthReference = t.monthReference;
        yearReference = t.yearReference;
      } else {
        // Calcula com base na data (empurrando para fatura do mês seguinte)
        monthReference = dataTransacao.getMonth() + 2;
        yearReference = dataTransacao.getFullYear();

        if (monthReference > 12) {
          monthReference = 1;
          yearReference++;
        }
      }

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
