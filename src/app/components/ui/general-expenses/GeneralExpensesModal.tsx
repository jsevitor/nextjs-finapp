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
  onChange: (expense: GeneralExpense | null) => void;
  onClose: () => void;
  onSubmit: (expense: GeneralExpense) => void;
};

export default function GeneralExpensesModal({
  isOpen,
  expense,
  onChange,
  onClose,
  onSubmit,
}: GeneralExpensesModalProps) {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (!expense) return null;

  // Define a função handleChange com um tipo específico para 'value'
  const handleChange = (
    field: keyof GeneralExpense,
    value: string | number | null
  ) => {
    onChange({ ...expense, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(expense);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <HeaderModal
        title={expense.id ? "Editar Transação" : "Adicionar Transação"}
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
        <div className="grid gap-3">
          <Label htmlFor="monthReference">Mês de Referência</Label>
          <Select
            onValueChange={(value) =>
              handleChange("monthReference", Number(value))
            }
            defaultValue={
              expense.monthReference?.toString() ??
              (new Date().getMonth() + 1).toString()
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Mês" />
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
          <Label htmlFor="yearReference">Ano de Referência</Label>
          <Select
            onValueChange={(value) =>
              handleChange("yearReference", Number(value))
            }
            defaultValue={
              expense.yearReference?.toString() ??
              new Date().getFullYear().toString()
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ano" />
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
          />
        </div>

        <div className="grid gap-3">
          <Label>Valor</Label>
          <Input
            type="number"
            value={expense.amount}
            onChange={(e) =>
              handleChange("amount", parseFloat(e.target.value) || 0)
            }
          />
        </div>

        <div className="grid gap-3">
          <Label>Vencimento</Label>
          <Input
            type="date"
            value={expense.dueDate ? expense.dueDate.split("T")[0] : ""}
            onChange={(e) =>
              handleChange("dueDate", new Date(e.target.value).toISOString())
            }
          />
        </div>

        <div className="grid gap-3">
          <Label>Categoria</Label>
          <Select
            onValueChange={(value) => handleChange("categoryId", value)}
            defaultValue={expense.categoryId || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione" />
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
      </form>

      <div className="col-span-2 flex justify-center mt-8 gap-4">
        <Button variant="outline" onClick={onClose} className="w-1/2 lg:w-1/3">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} className="w-1/2 lg:w-1/3">
          Salvar
        </Button>
      </div>
    </Modal>
  );
}
