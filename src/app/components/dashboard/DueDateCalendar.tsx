import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type DueDateCalendar = {
  id: string;
  description: string;
  dueDate: string;
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
  const [dueDate, setDueDate] = useState<DueDateCalendar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/analytics/payment-due-date?month=${month}&year=${year}`
        );
        const data = await res.json();
        setDueDate(data);
      } catch (err) {
        console.error("❌ Erro ao carregar vencimentos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [month, year]);

  const dueDates = dueDate.map(
    (v) => new Date(v.dueDate.split("T")[0] + "T00:00:00")
  );

  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-center">
        {loading ? (
          <div className="w-full flex items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin mr-2 text-primary/30" />
          </div>
        ) : (
          <Calendar
            mode="single"
            locale={ptBR}
            defaultMonth={new Date(year, month - 1)}
            modifiers={{
              vencimento: dueDates,
            }}
            modifiersClassNames={{
              vencimento: "bg-red-500 text-white rounded-full",
            }}
            className="rounded-md border"
          />
        )}
      </CardContent>
    </Card>
  );
}
