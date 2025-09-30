// src/app/components/dashboard/UpcomingDueDates.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Bell } from "lucide-react";
import { formatCurrencyBRL, formatDateBR } from "@/utils/format";

type ApiItem = {
  id: string;
  description?: string;
  // algumas rotas retornam `date`, outras `dueDate` — aceitarmos ambos
  date?: string | null;
  dueDate?: string | null;
  amount: number;
};

type DueDate = {
  id: string;
  description: string;
  date: Date; // já normalizado como "date-only" local
  amount: number;
};

export default function UpcomingDueDates({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const [data, setData] = useState<DueDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpcoming() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/analytics/payment-due-date?month=${month}&year=${year}`
        );
        const json = await res.json();

        if (!Array.isArray(json)) {
          console.error("❌ Unexpected response from payment-due-date:", json);
          setData([]);
          return;
        }

        // Normaliza e converte as datas (tratando timezone usando UTC -> date-only)
        const normalized: DueDate[] = (json as ApiItem[])
          .map((it) => {
            const iso = it.dueDate ?? it.date ?? null;
            if (!iso) return null;

            const d = new Date(iso);
            if (isNaN(d.getTime())) return null;

            // cria um "date-only" usando os getters UTC pra evitar shift de fuso
            const localDate = new Date(
              d.getUTCFullYear(),
              d.getUTCMonth(),
              d.getUTCDate()
            );

            return {
              id: it.id,
              description: it.description ?? "Vencimento",
              date: localDate,
              amount: Number(it.amount) || 0,
            } as DueDate;
          })
          .filter(Boolean) as DueDate[];

        // Ordena por data e pega os próximos 7
        normalized.sort((a, b) => a.date.getTime() - b.date.getTime());
        setData(normalized.slice(0, 7));
      } catch (err) {
        console.error("❌ Erro ao buscar próximos vencimentos:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUpcoming();
  }, [month, year]);

  return (
    <Card className="bg-yellow-500 text-white shadow-md">
      <CardHeader className="flex flex-row items-center gap-2">
        <Bell className="w-5 h-5" />
        <CardTitle>Próximos Vencimentos</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : data.length > 0 ? (
          <ul className="space-y-2">
            {data.map((item) => (
              <li
                key={item.id}
                className="flex justify-between border-b border-white/30 pb-1"
              >
                <span>
                  {formatDateBR(item.date)} - {item.description}
                </span>
                <span className="font-bold">
                  {formatCurrencyBRL(item.amount)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/80">Nenhum vencimento</p>
        )}
      </CardContent>
    </Card>
  );
}
