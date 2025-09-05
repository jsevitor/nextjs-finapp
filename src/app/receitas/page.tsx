"use client";

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
import { DataTable } from "../components/common/DataTable";
import { Column } from "../types/tableColumns";
import { TrendingUp } from "lucide-react";
import { FiltersContainer } from "../components/filters/FiltersContainer";
import PageContainer from "../components/layout/PageContainer";

export default function Income() {
  const income = [
    {
      id: 1,
      date: "2023-09-01",
      author: "Vitor",
      source: "Salário",
      description: "Pagamento mensal",
      category: "Trabalho",
      amount: "$5,000.00",
    },
    {
      id: 2,
      date: "2023-09-05",
      author: "João",
      source: "Freelance",
      description: "Projeto de design",
      category: "Serviços",
      amount: "$1,200.00",
    },
  ];

  const columns: Column<(typeof income)[0]>[] = [
    { key: "date", label: "Data" },
    { key: "author", label: "Autor" },
    { key: "source", label: "Fonte" },
    { key: "description", label: "Descrição" },
    { key: "category", label: "Categoria" },
    { key: "amount", label: "Valor", align: "right" },
  ];

  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Receitas">
          <TrendingUp className="h-8 w-8" />
        </HeaderTitle>
        <DialogAdd title="Adicionar Receita">
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
              <Label htmlFor="source-1">Fonte</Label>
              <Input id="source-1" name="source" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description-1">Descrição</Label>
              <Input id="description-1" name="description" />
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

      <FiltersContainer></FiltersContainer>

      <div className="border rounded-2xl overflow-hidden">
        <DataTable
          caption="Lista de Receitas"
          columns={columns}
          data={income}
          onEdit={(row) => console.log("Editando", row)}
          onDelete={(row) => console.log("Deletando", row)}
        />
      </div>
    </PageContainer>
  );
}
