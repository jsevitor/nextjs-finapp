"use client";

import { DialogAdd } from "../components/layout/DialogAdd";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "../components/common/Header";
import HeaderTitle from "../components/common/HeaderTitle";
import PageContainer from "../components/layout/PageContainer";
import { CreditCard } from "lucide-react";
import { FiltersContainer } from "../components/filters/FiltersContainer";
import { DataTable } from "../components/common/DataTable";
import { Column } from "../types/tableColumns";

export default function CardsPage() {
  const cards = [
    {
      id: 1,
      name: "Cartão 1",
      closingDate: "31",
      dueDate: "8",
    },
    {
      id: 2,
      name: "Cartão 2",
      closingDate: "15",
      dueDate: "20",
    },
  ];

  const columns: Column<(typeof cards)[0]>[] = [
    { key: "name", label: "Nome" },
    { key: "closingDate", label: "Dia de Fechamento" },
    { key: "dueDate", label: "Dia de Vencimento" },
  ];

  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Cartões">
          <CreditCard className="h-8 w-8" />
        </HeaderTitle>
        <DialogAdd title="Adicionar Cartão">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label htmlFor="date-1">Nome</Label>
              <Input id="name-1" name="name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="closingDay-1">Dia de Fechamento</Label>
              <Input id="closingDay-1" name="closingDay" type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="dueDay-2">Dia de Vencimento</Label>
              <Input id="dueDay-2" name="dueDay" type="number" />
            </div>
          </div>
        </DialogAdd>
      </Header>

      <FiltersContainer></FiltersContainer>

      <div className="border rounded-2xl overflow-hidden">
        <DataTable
          caption="Lista de Receitas"
          columns={columns}
          data={cards}
          onEdit={(row) => console.log("Editando", row)}
          onDelete={(row) => console.log("Deletando", row)}
        />
      </div>
    </PageContainer>
  );
}
