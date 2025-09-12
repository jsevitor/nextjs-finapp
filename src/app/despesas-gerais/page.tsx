"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { DataTable } from "../components/common/DataTable";
import { Column } from "../types/tableColumns";
import Header from "../components/common/Header";
import HeaderTitle from "../components/common/HeaderTitle";
import { FiltersContainer } from "../components/filters/FiltersContainer";
import FilterPeriod from "../components/filters/FilterPeriod";
import FilterCategory from "../components/filters/FilterCategory";
import PageContainer from "../components/layout/PageContainer";
import { ButtonVariant } from "../components/common/ButtonVariant";
import {
  GeneralExpense,
  useGeneralExpensesStore,
} from "@/stores/generalExpesnsesStore";
import GeneralExpensesModal from "../components/ui/general-expenses/GeneralExpensesModal";
import { formatCurrencyBRL, formatDateBR } from "@/utils/format";
import { useGeneralExpensesFilters } from "@/hooks/useGeneralExpensesFilters";

export default function GeneralExpensesPage() {
  // Hook novo com filtros + dados filtrados
  const { filters, generalExpenses, isLoading, setFilter } =
    useGeneralExpensesFilters();

  // Store só para ações de CRUD
  const { addGeneralExpense, updateGeneralExpense, removeGeneralExpense } =
    useGeneralExpensesStore();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState<GeneralExpense | null>(
    null
  );

  const columns: Column<GeneralExpense>[] = [
    {
      key: "dueDate",
      label: "Vencimento",
      render: (row) => formatDateBR(row.dueDate),
    },
    { key: "description", label: "Descrição" },
    {
      key: "categoryId",
      label: "Categoria",
      render: (row) => row.categoryName ?? "—",
    },
    {
      key: "amount",
      label: "Valor",
      align: "right",
      render: (row) => formatCurrencyBRL(row.amount),
    },
  ];

  const handleOpenAddModal = () => {
    setIsBeingEdited({
      id: "",
      description: "",
      amount: 0,
      dueDate: new Date().toISOString().split("T")[0],
      categoryId: "",
      profileId: "",
      userId: "",
    });
    setModalIsOpen(true);
  };

  const handleSubmit = async (expense: GeneralExpense) => {
    try {
      if (!expense.id) {
        await addGeneralExpense(expense);
      } else {
        await updateGeneralExpense(expense);
      }
      setModalIsOpen(false);
      setIsBeingEdited(null);
    } catch (err) {
      console.error("Erro ao salvar despesa geral:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeGeneralExpense(id);
    } catch (err) {
      console.error("Erro ao deletar despesa geral:", err);
    }
  };

  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Despesas Gerais">
          <Wallet className="h-8 w-8" />
        </HeaderTitle>

        <ButtonVariant typeAction="add" action={handleOpenAddModal} />

        <GeneralExpensesModal
          isOpen={modalIsOpen}
          expense={isBeingEdited}
          onChange={setIsBeingEdited}
          onClose={() => setModalIsOpen(false)}
          onSubmit={handleSubmit}
        />
      </Header>

      <FiltersContainer>
        {/* Período */}
        <FilterPeriod
          value={{
            monthReference: Number(filters.monthReference),
            yearReference: Number(filters.yearReference),
          }}
          onChange={(month, year) => {
            setFilter("monthReference", month);
            setFilter("yearReference", year);
          }}
        />

        {/* Categoria */}
        <FilterCategory
          value={filters.category}
          onChange={(categoryId) => setFilter("category", categoryId)}
        />
      </FiltersContainer>

      <div className="border rounded-2xl overflow-hidden">
        <DataTable
          caption="Lista de despesas gerais"
          columns={columns}
          data={generalExpenses}
          isLoading={isLoading}
          onEdit={(row) => {
            setIsBeingEdited(row);
            setModalIsOpen(true);
          }}
          onDelete={(row) => handleDelete(row.id)}
        />
      </div>
    </PageContainer>
  );
}
