import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/utils/format";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";

type SummaryData = {
  transactionsTotal: number;
  transactionsVariation: number;
  housingTotal: number;
  topTransactions: { description: string; amount: number }[];
};

export default function SummaryCards({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const [data, setData] = useState<SummaryData | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      setData(null); // força loading
      const res = await fetch(
        `/api/analytics/summary?month=${month}&year=${year}`
      );
      const json = await res.json();
      setData(json);
    }
    fetchSummary();
  }, [month, year]);

  if (!data) {
    return (
      <div className="w-full flex items-center justify-center p-8 border rounded-2xl shadow">
        <Loader2 className="h-12 w-12 animate-spin mr-2 text-primary/30" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Card 1: Total Transactions + Variação */}
      <Card>
        <CardHeader>
          <CardTitle>Total do mês (Transactions)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center lg:items-start gap-2">
          <p className="text-2xl font-bold">
            {formatCurrencyBRL(data.transactionsTotal)}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {data.transactionsVariation >= 0 ? (
              <ArrowUp className="w-4 h-4 text-red-500" />
            ) : (
              <ArrowDown className="w-4 h-4 text-green-500" />
            )}
            {Math.abs(data.transactionsVariation).toFixed(1)}% vs mês passado
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Gastos com Moradia */}
      <Card>
        <CardHeader>
          <CardTitle>Gastos com Moradia</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center lg:text-left text-2xl font-bold">
            {formatCurrencyBRL(data.housingTotal)}
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Top 3 maiores gastos */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Top 3 gastos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row justify-between gap-2">
          {data.topTransactions.length > 0 ? (
            data.topTransactions.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-2 lg:p-4 lg:w-full rounded-2xl bg-muted-foreground/10"
              >
                <span className="text-xs text-muted-foreground">
                  {t.description}
                </span>
                <span className="text-xl font-bold">
                  {formatCurrencyBRL(t.amount)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">Nenhum gasto</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
