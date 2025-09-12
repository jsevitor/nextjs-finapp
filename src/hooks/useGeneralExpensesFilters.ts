import { useEffect, useCallback, useMemo } from "react";
import { useFiltersStore } from "@/stores/filtersStore";
import { debugFilters } from "@/utils/debug";
import { useGeneralExpensesStore } from "@/stores/generalExpesnsesStore";

export const useGeneralExpensesFilters = () => {
  const { filters, setFilters, setFilter, resetFilters } = useFiltersStore();
  const {
    generalExpenses,
    isLoading,
    error,
    fetchGeneralExpenses,
    clearError,
  } = useGeneralExpensesStore();

  // Busca inicial e sempre que filtros obrigatórios mudarem
  useEffect(() => {
    if (filters.monthReference && filters.yearReference) {
      debugFilters(filters, "GeneralExpenses Effect Triggered");
      fetchGeneralExpenses(filters);
    } else {
      console.warn("⚠️ Filtros obrigatórios ausentes:", {
        month: filters.monthReference,
        year: filters.yearReference,
      });
    }
  }, [
    filters.monthReference,
    filters.yearReference,
    filters.category,
    filters.minValue,
    filters.maxValue,
    fetchGeneralExpenses,
  ]);

  // Filtro local para busca por texto (caso queira buscar em descrição ou categoria)
  const filteredExpenses = useMemo(() => {
    if (!filters.searchTerm || !filters.searchField) {
      return generalExpenses;
    }

    const searchTerm = filters.searchTerm.toLowerCase();

    return generalExpenses.filter((expense) => {
      switch (filters.searchField) {
        case "description":
          return expense.description?.toLowerCase().includes(searchTerm);
        case "category":
          return expense.categoryName?.toLowerCase().includes(searchTerm);
        default:
          return true;
      }
    });
  }, [generalExpenses, filters.searchTerm, filters.searchField]);

  const applyFilters = useCallback(() => {
    if (filters.monthReference && filters.yearReference) {
      debugFilters(filters, "GeneralExpenses Manual Apply");
      fetchGeneralExpenses(filters);
    }
  }, [filters, fetchGeneralExpenses]);

  const resetToDefault = useCallback(() => {
    console.log("🔄 Resetando filtros de despesas gerais para padrão");
    resetFilters();
    clearError();
  }, [resetFilters, clearError]);

  return {
    // Estado
    filters,
    generalExpenses: filteredExpenses,
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
    totalAmount: filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0),
  };
};
