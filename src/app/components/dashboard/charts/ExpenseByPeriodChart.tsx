// src/app/components/dashboard/charts/ExpenseByPeriodChart.tsx
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface ExpenseData {
  month: number;
  totalAmount: number;
}

export default function ExpenseByPeriodChart({ year }: { year: number }) {
  const [data, setData] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/analytics/expenses-by-period?year=${year}`
        );
        const json = await res.json();
        setData(json.data || []);
      } catch (error) {
        console.error("Erro ao buscar dados de despesas por período:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [year]);

  const monthLabels = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Gastos por Período (Ano Corrente)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(m) => monthLabels[m - 1]}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) =>
                    `R$ ${value.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}`
                  }
                  labelFormatter={(m) => monthLabels[m - 1]}
                />
                <Line
                  type="monotone"
                  dataKey="totalAmount"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
