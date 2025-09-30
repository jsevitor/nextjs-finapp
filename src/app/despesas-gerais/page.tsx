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
import { toast } from "react-toastify";

export default function GeneralExpensesPage() {
  const { filters, generalExpenses, isLoading, setFilter } =
    useGeneralExpensesFilters();

  const {
    isLoading: isLoadingGeneralExpenses,
    addGeneralExpense,
    updateGeneralExpense,
    removeGeneralExpense,
  } = useGeneralExpensesStore();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState<GeneralExpense | null>(
    null
  );

  const createEmptyExpense = (): GeneralExpense => {
    const today = new Date();
    const isoToday = `${today.getUTCFullYear()}-${String(
      today.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(today.getUTCDate()).padStart(
      2,
      "0"
    )}T00:00:00Z`;

    return {
      id: "",
      description: "",
      amount: 0,
      date: isoToday,
      dueDay: today.getUTCDate(),
      categoryId: "",
      profileId: "", // ⚠️ Preencher com base no auth, se necessário
      userId: "", // ⚠️ Preencher com base no auth, se necessário
      monthReference: today.getUTCMonth() + 1,
      yearReference: today.getUTCFullYear(),
      installmentNumber: null,
      installmentTotal: 1,
      parentId: null,
    };
  };

  const handleOpenAddModal = () => {
    setIsBeingEdited(createEmptyExpense());
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
      toast.success("Despesa geral salva com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar despesa geral:", err);
      toast.error("Erro ao salvar despesa geral!");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeGeneralExpense(id);
      toast.success("Despesa geral removida com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar despesa geral:", err);
      toast.error("Erro ao deletar despesa geral!");
    }
  };

  const columns: Column<GeneralExpense>[] = [
    {
      key: "date",
      label: "Data",
      render: (row) => formatDateBR(row.date),
    },
    { key: "description", label: "Descrição" },
    {
      key: "categoryId",
      label: "Categoria",
      render: (row) => row.categoryName ?? "—",
    },
    {
      key: "business",
      label: "Estabelecimento",
      render: (row) => row.business ?? "—",
    },
    {
      key: "amount",
      label: "Valor",
      align: "right",
      render: (row) => formatCurrencyBRL(row.amount),
    },
    {
      key: "installmentNumber",
      label: "Parcela",
      render: (row) =>
        row.installmentTotal && row.installmentNumber
          ? `${row.installmentNumber}/${row.installmentTotal}`
          : "—",
    },
    {
      key: "dueDay",
      label: "Vencimento",
      render: (row) => row.dueDay ?? "—",
    },
  ];

  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Despesas Gerais">
          <Wallet className="h-8 w-8" />
        </HeaderTitle>

        <ButtonVariant typeAction="add" action={handleOpenAddModal} />

        <GeneralExpensesModal
          isLoading={isLoadingGeneralExpenses}
          isOpen={modalIsOpen}
          expense={isBeingEdited}
          onChange={setIsBeingEdited}
          onClose={() => {
            setModalIsOpen(false);
            setIsBeingEdited(null);
          }}
          onSubmit={handleSubmit}
        />
      </Header>

      <FiltersContainer>
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
