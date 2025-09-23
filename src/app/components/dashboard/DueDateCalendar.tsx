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
  const [selected, setSelected] = useState<Date | undefined>();
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
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Calendário de Vencimentos
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4 items-center">
        {loading ? (
          <div className="w-full flex items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin mr-2 text-primary/30" />
          </div>
        ) : (
          <>
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
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

            {selected && (
              <div className="mt-4 w-full h-full text-sm">
                <p className="font-medium mb-2">
                  Vencimentos em{" "}
                  {selected.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  :
                </p>
                <ul className="space-y-1">
                  {dueDate
                    .filter(
                      (v) =>
                        new Date(
                          v.dueDate.split("T")[0] + "T00:00:00"
                        ).toDateString() === selected.toDateString()
                    )
                    .map((v) => (
                      <li
                        key={v.id}
                        className="flex justify-between border-b py-1 text-muted-foreground"
                      >
                        <span>{v.description}</span>
                        <span className="font-medium text-foreground">
                          R$ {v.amount.toFixed(2)}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
