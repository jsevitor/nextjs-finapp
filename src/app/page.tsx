"use client";

import { LayoutDashboard } from "lucide-react";
import Header from "./components/common/Header";
import HeaderTitle from "./components/common/HeaderTitle";
import PageContainer from "./components/layout/PageContainer";
import CategoriesCard from "./components/dashboard/CategoriesCard";

export default function Home() {
  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Dashboard">
          <LayoutDashboard className="h-8 w-8" />
        </HeaderTitle>
      </Header>
      <CategoriesCard />
    </PageContainer>
  );
}
