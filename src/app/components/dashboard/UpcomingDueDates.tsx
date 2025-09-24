import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Bell } from "lucide-react";
import { formatCurrencyBRL, formatDateBR } from "@/utils/format";

type DueDate = {
  id: string;
  description: string;
  dueDate: string;
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
        // ordena por data e pega só próximos 5
        const sorted = json.sort(
          (a: DueDate, b: DueDate) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
        setData(sorted.slice(0, 7));
      } catch (err) {
        console.error("❌ Erro ao buscar próximos vencimentos:", err);
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
                  {formatDateBR(item.dueDate)} - {item.description}
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
