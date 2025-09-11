// app/transacoes/page.tsx - REFORMULADO
"use client";

import { useState } from "react";
import { TrendingDown } from "lucide-react";
import { DataTable } from "../components/common/DataTable";
import { Column } from "../types/tableColumns";
import Header from "../components/common/Header";
import HeaderTitle from "../components/common/HeaderTitle";
import { FiltersContainer } from "../components/filters/FiltersContainer";
import FilterPeriod from "../components/filters/FilterPeriod";
import FilterCategory from "../components/filters/FilterCategory";
import FilterCard from "../components/filters/FilterCard";
import PageContainer from "../components/layout/PageContainer";
import { ButtonVariant } from "../components/common/ButtonVariant";
import { Transaction, useTransactionsStore } from "@/stores/transactionsStore";
import TransactionsModal from "../components/ui/transactions/TransactionsModal";
import { formatCurrencyBRL, formatDateBR } from "@/utils/format";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";

export default function TransactionsPage() {
  const { filters, transactions, isLoading, setFilter, setFilters } =
    useTransactionFilters();

  const { addTransaction, updateTransaction, removeTransaction } =
    useTransactionsStore();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState<Transaction | null>(null);

  const columns: Column<Transaction>[] = [
    { key: "date", label: "Data", render: (row) => formatDateBR(row.date) },
    {
      key: "profileId",
      label: "Autor",
      render: (row) => row.profileName ?? "—",
    },
    { key: "business", label: "Estabelecimento" },
    { key: "description", label: "Descrição" },
    {
      key: "categoryId",
      label: "Categoria",
      render: (row) => row.categoryName ?? "—",
    },
    { key: "installmentNumber", label: "Parcela", align: "right" },
    { key: "installmentTotal", label: "Parcelas", align: "right" },
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
      date: new Date().toISOString().split("T")[0],
      business: "",
      description: "",
      amount: 0,
      cardId: filters.card, // já vem do filtro
      profileId: "",
      categoryId: "",
      installmentNumber: 1,
      installmentTotal: 1,
      parentId: null,
      monthReference: filters.monthReference,
      yearReference: filters.yearReference,
    });
    setModalIsOpen(true);
  };

  const handleSubmit = async (transaction: Transaction) => {
    try {
      if (!transaction.id) {
        await addTransaction(transaction);
      } else {
        await updateTransaction(transaction);
      }
      setModalIsOpen(false);
      setIsBeingEdited(null);
    } catch (err) {
      console.error("Erro ao salvar transação:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeTransaction(id);
    } catch (err) {
      console.error("Erro ao deletar transação:", err);
    }
  };

  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Transações">
          <TrendingDown className="h-8 w-8" />
        </HeaderTitle>

        <ButtonVariant typeAction="add" action={handleOpenAddModal} />

        <TransactionsModal
          isOpen={modalIsOpen}
          transaction={isBeingEdited}
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
          onChange={(monthReference, yearReference) => {
            setFilter("monthReference", monthReference);
            setFilter("yearReference", yearReference);
          }}
        />

        {/* Categoria */}
        <FilterCategory
          value={filters.category}
          onChange={(categoryId) => setFilter("category", categoryId)}
        />

        {/* Cartão */}
        <FilterCard
          value={filters.card}
          onChange={(cardId) => setFilter("card", cardId)}
        />
      </FiltersContainer>

      <div className="border rounded-2xl overflow-hidden">
        <DataTable
          caption="Lista de transações"
          columns={columns}
          data={transactions}
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
