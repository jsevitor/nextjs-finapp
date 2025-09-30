import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ExpenseCategoryData {
  categoryId: string;
  categoryName: string;
  total: number;
}

interface ChartDataInput {
  [key: string]: string | number;
  categoryName: string;
  total: number;
}

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#ec4899",
  "#6b7280",
];

export default function ExpenseByCategoryChart({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const [data, setData] = useState<ChartDataInput[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/analytics/expenses-by-category?month=${month}&year=${year}`
        );
        const json = await res.json();
        setData(
          (json ?? [])
            .filter((item: { total: number }) => item.total > 0)
            .map((item: ExpenseCategoryData) => ({
              categoryName: item.categoryName,
              total: item.total,
            }))
        );
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [month, year]);

  const top5 = [...data].sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl font-bold">
          Gastos por Categoria
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="w-full flex items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin mr-2 text-primary/30" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum gasto encontrado
          </p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={top5}
                  dataKey="total"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                >
                  {top5.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `R$ ${value.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}`
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
