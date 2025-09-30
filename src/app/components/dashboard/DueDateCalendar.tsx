"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type DueDateCalendarItem = {
  id: string;
  description: string;
  date: string; // vem do backend em ISO
  amount: number;
  categoryName?: string | null;
};

export default function DueDateCalendar({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const [expenses, setExpenses] = useState<DueDateCalendarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/analytics/payment-due-date?month=${month}&year=${year}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setExpenses(data);
        } else {
          setExpenses([]);
        }
      } catch (err) {
        console.error("❌ Erro ao carregar vencimentos:", err);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [month, year]);

  // ✅ Corrigido: usa UTC para evitar "um dia a menos"
  const dates = expenses
    .filter((expense) => expense.date)
    .map((expense) => {
      const d = new Date(expense.date);
      return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    });

  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-center">
        {loading ? (
          <div className="w-full flex items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin mr-2 text-primary/30" />
          </div>
        ) : (
          <Calendar
            mode="multiple"
            selected={dates}
            locale={ptBR}
            defaultMonth={new Date(year, month - 1)}
            modifiers={{
              vencimento: dates,
            }}
            modifiersClassNames={{
              vencimento: "bg-red-500 text-white rounded-full", // cor para vencimento
              selected: "bg-blue-500 text-white rounded-full", // cor para selecionado manual
            }}
            classNames={{
              day_selected: "bg-blue-500 text-white rounded-full", // sobrescreve padrão
            }}
            className="rounded-md border"
          />
        )}
      </CardContent>
    </Card>
  );
}
