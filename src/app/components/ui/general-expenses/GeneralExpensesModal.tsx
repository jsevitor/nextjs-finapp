"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GeneralExpense } from "@/stores/generalExpesnsesStore";
import { Modal } from "../../layout/Modal";
import HeaderModal from "../../common/HeaderModal";
import { useCategoryStore } from "@/stores/categoryStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type GeneralExpensesModalProps = {
  isOpen: boolean;
  expense: GeneralExpense | null;
  isLoading: boolean;
  onChange: (expense: GeneralExpense | null) => void;
  onClose: () => void;
  onSubmit: (expense: GeneralExpense) => void;
};

export default function GeneralExpensesModal({
  isOpen,
  expense,
  isLoading,
  onChange,
  onClose,
  onSubmit,
}: GeneralExpensesModalProps) {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (!expense) return null;

  const handleChange = (
    field: keyof GeneralExpense,
    value: string | number | null
  ) => {
    onChange({ ...expense, [field]: value } as GeneralExpense);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(expense);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <HeaderModal
        title={expense.id ? "Editar Despesa" : "Adicionar Despesa"}
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
        <div className="grid gap-3">
          <Label>Mês de Referência</Label>
          <Select
            onValueChange={(value) =>
              handleChange("monthReference", Number(value))
            }
            value={expense.monthReference?.toString() ?? ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              {monthOptions.map((month) => (
                <SelectItem key={month} value={month.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <Label>Ano de Referência</Label>
          <Select
            onValueChange={(value) =>
              handleChange("yearReference", Number(value))
            }
            value={expense.yearReference?.toString() ?? ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <Label>Descrição</Label>
          <Input
            value={expense.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Ex: Supermercado"
          />
        </div>

        <div className="grid gap-3">
          <Label>Estabelecimento</Label>
          <Input
            value={expense.business || ""}
            onChange={(e) => handleChange("business", e.target.value)}
            placeholder="Ex: Mercado do Zé"
          />
        </div>

        <div className="grid gap-3">
          <Label>Valor</Label>
          <Input
            type="number"
            value={String(expense.amount ?? "")}
            onChange={(e) =>
              handleChange("amount", parseFloat(e.target.value) || 0)
            }
            placeholder="0.00"
            min={0}
            step="0.01"
          />
        </div>

        <div className="grid gap-3">
          <Label>Data da Compra</Label>
          <Input
            type="date"
            value={expense.date ? expense.date.split("T")[0] : ""}
            onChange={(e) => {
              const val = e.target.value;
              handleChange("date", val ? `${val}T00:00:00Z` : null);
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Dia de Vencimento</Label>
          <Input
            type="number"
            min={1}
            max={31}
            value={expense.dueDay?.toString() ?? ""}
            onChange={(e) =>
              handleChange(
                "dueDay",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
            placeholder="Ex: 10"
          />
        </div>

        <div className="grid gap-3">
          <Label>Categoria</Label>
          <Select
            onValueChange={(value) => handleChange("categoryId", value)}
            value={expense.categoryId || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <Label>Total de Parcelas</Label>
          <Input
            type="number"
            min={1}
            value={String(expense.installmentTotal ?? 1)}
            onChange={(e) =>
              handleChange(
                "installmentTotal",
                e.target.value === "" ? 1 : Number(e.target.value)
              )
            }
          />
        </div>

        <div className="col-span-2 flex justify-center mt-8 gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            className="w-1/2 lg:w-1/3"
          >
            Cancelar
          </Button>
          <Button type="submit" className="w-1/2 lg:w-1/3">
            {expense.id
              ? isLoading
                ? "Carregando..."
                : "Salvar"
              : isLoading
              ? "Carregando..."
              : "Adicionar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
