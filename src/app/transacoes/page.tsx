// app/transacoes/page.tsx - REFORMULADO
"use client";

import { useState } from "react";
import { Loader2, RefreshCw, Trash2, TrendingDown } from "lucide-react";
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
import FilterMinValue from "../components/filters/FilterMinValue";
import FilterMaxValue from "../components/filters/FilterMaxValue";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function TransactionsPage() {
  const { filters, transactions, isLoading, setFilter } =
    useTransactionFilters();

  const {
    isLoading: isLoadingTransactions,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
    removeTransactionsBulk,
  } = useTransactionsStore();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState<Transaction | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
      cardId: filters.card || "",
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
        setIsBeingEdited({
          id: "",
          date: new Date().toISOString().split("T")[0],
          business: "",
          description: "",
          amount: 0,
          cardId: filters.card || "",
          profileId: "",
          categoryId: "",
          installmentNumber: 1,
          installmentTotal: 1,
          parentId: null,
          monthReference: filters.monthReference,
          yearReference: filters.yearReference,
        });
        toast.success("Transação salva com sucesso!");
      } else {
        await updateTransaction(transaction);
        setModalIsOpen(false);
        toast.success("Transação atualizada com sucesso!");
        setIsBeingEdited(null);
      }
    } catch (err) {
      console.error("Erro ao salvar transação:", err);
      toast.error("Erro ao salvar transação!");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeTransaction(id);
      toast.success("Transação removida com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar transação:", err);
      toast.error("Erro ao deletar transação!");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await removeTransactionsBulk(selectedIds);
      toast.success("Transações removidas com sucesso!");
      setSelectedIds([]);
      setBulkMode(false);
    } catch (err) {
      console.error("Erro ao deletar em lote:", err);
      toast.error("Erro ao deletar em lote!");
    }
  };

  return (
    <PageContainer>
      <Header>
        <HeaderTitle title="Transações">
          <TrendingDown className="h-8 md:w-8" />
        </HeaderTitle>

        <ButtonVariant typeAction="add" action={handleOpenAddModal} />

        <TransactionsModal
          isLoading={isLoadingTransactions}
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
          value={filters.card || ""}
          onChange={(cardId) => setFilter("card", cardId)}
        />

        <FilterMinValue filters={filters} setFilter={setFilter} />

        <FilterMaxValue filters={filters} setFilter={setFilter} />
      </FiltersContainer>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant={bulkMode ? "secondary" : "outline"}
            onClick={() => {
              setBulkMode(!bulkMode);
              setSelectedIds([]);
            }}
          >
            {bulkMode ? "Cancelar seleção" : "Selecionar múltiplas"}
          </Button>
          {bulkMode && selectedIds.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Excluir Selecionados
            </Button>
          )}
        </div>

        <div>
          <Button
            variant="outline"
            onClick={() => fetchTransactions(filters)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>
      </div>

      <div className="border rounded-2xl overflow-hidden">
        <DataTable
          columns={columns}
          data={transactions}
          isLoading={isLoading}
          bulkMode={bulkMode}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
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
