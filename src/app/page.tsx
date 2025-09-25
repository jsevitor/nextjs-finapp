"use client";

import { useState } from "react";
import { LayoutDashboard } from "lucide-react";
import Header from "./components/common/Header";
import HeaderTitle from "./components/common/HeaderTitle";
import PageContainer from "./components/layout/PageContainer";
import ExpenseByPeriodChart from "./components/dashboard/charts/ExpenseByPeriodChart";
import ExpenseByProfileChart from "./components/dashboard/charts/ExpenseByProfileChart";
import ExpensesByCategoryChart from "./components/dashboard/charts/ExpensesByCategoryChart";
import DueDateCalendar from "./components/dashboard/DueDateCalendar";
import SummaryCards from "./components/dashboard/SummaryCards";
import WelcomeCard from "./components/dashboard/WelcomeCard";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { months } from "@/utils/months";
import UpcomingDueDates from "./components/dashboard/UpcomingDueDates";
import { useCardStore } from "@/stores/cardStore";

export default function Home() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 2);
  const [year, setYear] = useState(now.getFullYear());

  const { cards, fetchCards } = useCardStore();

  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Dashboard">
          <LayoutDashboard className="h-8 w-8" />
        </HeaderTitle>
      </Header>

      <div className="flex flex-col md:flex-row md:items-center gap-2 2xl:gap-4">
        <WelcomeCard />
        {/* Selects para mês/ano */}
        <div className="flex md:flex-col lg:flex-row justify-center gap-2">
          <Select
            value={String(month)}
            onValueChange={(v) => setMonth(Number(v))}
          >
            <SelectTrigger className="w-[140px] h-10 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={String(m.value)}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(year)}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger className="w-[140px] lg:w-[100px]  bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 2xl:gap-4">
        <SummaryCards month={month} year={year} />
        <UpcomingDueDates month={month} year={year} />
        <DueDateCalendar month={month} year={year} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 2xl:gap-4">
        <ExpenseByProfileChart month={month} year={year} />
        <ExpensesByCategoryChart month={month} year={year} />
      </div>

      <ExpenseByPeriodChart year={year} />
    </PageContainer>
  );
}
