// src/app/components/dashboard/charts/ExpenseByProfileChart.tsx
"use client";

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
import { Loader2 } from "lucide-react";
import { useSessionStore } from "@/stores/sessionStore";

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

  const { session } = useSessionStore(); // 👈 pega o usuário da store
  const userName = session?.user?.name?.toLowerCase() ?? ""; // nome do usuário logado

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/analytics/expenses-by-profile?month=${month}&year=${year}`
        );
        const json = await res.json();

        let filtered = (json ?? []).filter(
          (item: { totalAmount: number }) => item.totalAmount > 0
        );

        // 👇 Se o usuário não for "vitor", remove o perfil "vó"
        if (userName !== "vitor") {
          filtered = filtered.filter(
            (item: { profileName: string }) =>
              item.profileName?.toLowerCase() !== "vó"
          );
        }

        setData(filtered);
      } catch (error) {
        console.error("Erro ao buscar dados de despesas por perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [month, year, userName]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Gastos por Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full flex items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin mr-2 text-primary/30" />
          </div>
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
