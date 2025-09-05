"use client";

import { DataTable } from "../components/common/DataTable";
import { Column } from "../types/tableColumns";
import { DialogAdd } from "../components/layout/DialogAdd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "../components/common/Header";
import HeaderTitle from "../components/common/HeaderTitle";
import { FiltersContainer } from "../components/filters/FiltersContainer";
import FilterPeriod from "../components/filters/FilterPeriod";
import FilterCategory from "../components/filters/FilterCategory";
import FilterCard from "../components/filters/FilterCard";
import FilterMinValue from "../components/filters/FilterMinValue";
import FilterMaxValue from "../components/filters/FilterMaxValue";
import { useState } from "react";
import { TrendingDown } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";

export default function ExpensesPage() {
  const [filters, setFilters] = useState({
    date: "",
    category: "",
    card: "",
    minValue: "",
    maxValue: "",
    searchField: "",
    searchTerm: "",
  });

  const expenses = [
    {
      id: 1,
      date: "2023-09-01",
      author: "Vitor",
      establishment: "Restaurante X",
      description: "Almoco",
      category: "Comida",
      installment: 1,
      installments: 3,
      amount: "$50.00",
    },
    {
      id: 2,
      date: "2023-09-02",
      author: "João",
      establishment: "Restaurante Y",
      description: "Jantar",
      category: "Transporte",
      installment: 1,
      installments: 1,
      amount: "$20.00",
    },
  ];

  const columns: Column<(typeof expenses)[0]>[] = [
    { key: "date", label: "Data" },
    { key: "author", label: "Autor" },
    { key: "establishment", label: "Estabelecimento" },
    { key: "description", label: "Descrição" },
    { key: "category", label: "Categoria" },
    { key: "installment", label: "Parcela", align: "right" },
    { key: "installments", label: "Parcelas", align: "right" },
    { key: "amount", label: "Valor", align: "right" },
  ];

  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Despesas">
          <TrendingDown className="h-8 w-8" />
        </HeaderTitle>
        <DialogAdd title="Adicionar Despesa">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label htmlFor="date-1">Data</Label>
              <Input id="date-1" name="date" type="date" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="author-1">Autor</Label>
              <Input id="author-1" name="author" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="establishment-1">Estabelecimento</Label>
              <Input id="establishment-1" name="establishment" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description-1">Descrição</Label>
              <Input id="description-1" name="description" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="installment-1">Parcelas</Label>
              <Input id="installment-1" name="installment" type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="installment-2">Parcela Atual</Label>
              <Input id="installment-2" name="installment" type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="category-1">Categoria</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alimentacao">Alimentação</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                  <SelectItem value="lazer">Lazer</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="amount-1">Valor</Label>
              <Input id="amount-1" name="amount" placeholder="R$ 0" />
            </div>
          </div>
        </DialogAdd>
      </Header>

      <FiltersContainer>
        <FilterPeriod filters={filters} setFilters={setFilters} />
        <FilterCategory filters={filters} setFilters={setFilters} />
        <FilterCard filters={filters} setFilters={setFilters} />
        <FilterMinValue filters={filters} setFilters={setFilters} />
        <FilterMaxValue filters={filters} setFilters={setFilters} />
      </FiltersContainer>

      <div className="border rounded-2xl overflow-hidden">
        <DataTable
          caption="Lista de despesas"
          columns={columns}
          data={expenses}
          onEdit={(row) => console.log("Editando", row)}
          onDelete={(row) => console.log("Deletando", row)}
        />
      </div>
    </PageContainer>
  );
}
