// src/app/components/dashboard/charts/ExpenseByProfileChart.tsx
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface ExpenseProfileData {
  profileId: string;
  profileName: string;
  totalAmount: number;
}

export default function ExpenseByProfileChart({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const [data, setData] = useState<ExpenseProfileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/analytics/expenses-by-profile?month=${month}&year=${year}`
        );
        const json = await res.json();

        const filtered = (json ?? []).filter(
          (item: { totalAmount: number }) => item.totalAmount > 0
        );

        setData(filtered);
      } catch (error) {
        console.error("Erro ao buscar dados de despesas por perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [month, year]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Gastos por Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="profileName" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) =>
                    `R$ ${value.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}`
                  }
                />
                <Bar
                  dataKey="totalAmount"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
