import { use, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/utils/format";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { useSessionStore } from "@/stores/sessionStore";

type SummaryData = {
  transactionsTotal: number;
  transactionsVariation: number;
  housingTotal: number;
  topTransactions: { description: string; amount: number }[];
  summaryByProfile: { id: string; name: string; total: number }[];
};

export default function SummaryCards({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const [data, setData] = useState<SummaryData | null>(null);

  const { session } = useSessionStore();
  const userId = session.user?.id ?? "";

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

  // Pega resumo do usuário logado pelo ID
  const userSummary = data.summaryByProfile?.find(
    (p) => p.name === session.user?.name?.split(" ")[0]
  ) ?? {
    total: 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 2xl:gap-4">
      {/* Card 1: Total Transactions + Variação */}
      <Card className="bg-blue-500 text-white shadow-md">
        <CardHeader>
          <CardTitle>Total do mês</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center lg:items-start gap-2">
          <p className="text-2xl font-bold">
            {formatCurrencyBRL(data.transactionsTotal)}
          </p>
          <p className="text-sm flex items-center">
            {data.transactionsVariation >= 0 ? (
              <ArrowUp className="w-4 h-4 text-red-700 bg-red-500 rounded-full mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 text-green-700 bg-green-500 rounded-full mr-1" />
            )}
            {Math.abs(data.transactionsVariation).toFixed(1)}% mês passado
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Gastos do usuário logado */}
      <Card className="bg-green-500 text-white shadow-md">
        <CardHeader>
          <CardTitle>Seus gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center lg:text-left text-2xl font-bold">
            {formatCurrencyBRL(userSummary.total)}
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Gastos Moradia (só para seu usuário) */}
      {userId === "SEU_USER_ID_AQUI" && (
        <Card className="bg-red-500 text-white shadow-md">
          <CardHeader>
            <CardTitle>Gastos Moradia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center lg:text-left text-2xl font-bold">
              {formatCurrencyBRL(data.housingTotal)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Card 4: Top 3 gastos */}
      <Card className="md:col-span-2 bg-muted shadow-md">
        <CardHeader>
          <CardTitle>Top 3 gastos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row justify-between gap-2">
          {data.topTransactions.length > 0 ? (
            data.topTransactions.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start p-2 2xl:p-4 w-full rounded-2xl bg-background min-w-0"
              >
                <span
                  className="text-xs text-muted-foreground truncate w-full"
                  title={t.description}
                >
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
