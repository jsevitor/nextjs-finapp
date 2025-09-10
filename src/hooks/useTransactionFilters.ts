// hooks/useTransactionFilters.ts - COM DEBUG MELHORADO
import { useEffect, useCallback, useMemo } from "react";
import { useFiltersStore } from "@/stores/filtersStore";
import { useTransactionsStore } from "@/stores/transactionsStore";
import { debugFilters, debugTransactions } from "@/utils/debug";

export const useTransactionFilters = () => {
  const { filters, setFilters, setFilter, resetFilters } = useFiltersStore();
  const { transactions, isLoading, error, fetchTransactions, clearError } =
    useTransactionsStore();

  // Busca inicial e sempre que filtros obrigatórios mudarem
  useEffect(() => {
    if (filters.monthReference && filters.yearReference) {
      debugFilters(filters, "Effect Triggered");
      fetchTransactions(filters);
    } else {
      console.warn("⚠️ Filtros obrigatórios ausentes:", {
        month: filters.monthReference,
        year: filters.yearReference,
      });
    }
  }, [
    filters.monthReference,
    filters.yearReference,
    filters.card,
    filters.category,
    filters.minValue,
    filters.maxValue,
    fetchTransactions,
  ]);

  // Debug das transações sempre que mudarem
  useEffect(() => {
    debugTransactions(transactions, "Transactions Updated");
  }, [transactions]);

  // Filtro local para busca por texto (mais eficiente que backend)
  const filteredTransactions = useMemo(() => {
    if (!filters.searchTerm || !filters.searchField) {
      return transactions;
    }

    const searchTerm = filters.searchTerm.toLowerCase();

    const filtered = transactions.filter((transaction) => {
      switch (filters.searchField) {
        case "business":
          return transaction.business?.toLowerCase().includes(searchTerm);
        case "description":
          return transaction.description?.toLowerCase().includes(searchTerm);
        case "category":
          return transaction.categoryName?.toLowerCase().includes(searchTerm);
        default:
          return true;
      }
    });

    console.log(
      `🔍 Filtro de busca: ${filtered.length}/${transactions.length} transações`
    );
    return filtered;
  }, [transactions, filters.searchTerm, filters.searchField]);

  const applyFilters = useCallback(() => {
    if (filters.monthReference && filters.yearReference) {
      debugFilters(filters, "Manual Apply");
      fetchTransactions(filters);
    }
  }, [filters, fetchTransactions]);

  const resetToDefault = useCallback(() => {
    console.log("🔄 Resetando filtros para padrão");
    resetFilters();
    clearError();
  }, [resetFilters, clearError]);

  return {
    // Estado
    filters,
    transactions: filteredTransactions,
    isLoading,
    error,

    // Ações
    setFilters,
    setFilter,
    resetFilters: resetToDefault,
    applyFilters,
    clearError,

    // Computados
    hasActiveFilters: !!(
      filters.category ||
      filters.minValue ||
      filters.maxValue ||
      filters.searchTerm
    ),
    totalAmount: filteredTransactions.reduce(
      (sum, t) => sum + (t.amount || 0),
      0
    ),
  };
};
