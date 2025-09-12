// hooks/useHousingBillsFilters.ts
import { useEffect, useCallback, useMemo } from "react";
import { useFiltersStore } from "@/stores/filtersStore";
import { debugFilters } from "@/utils/debug";
import { useHousingBillsStore } from "@/stores/housingBillsStore";
import { useCategoryStore } from "@/stores/categoryStore";

export const useHousingBillsFilters = () => {
  const { filters, setFilters, setFilter, resetFilters } = useFiltersStore();
  const { housingBills, isLoading, error, fetchHousingBills, clearError } =
    useHousingBillsStore();
  const { categories } = useCategoryStore();

  const defaultCategoryId =
    categories.find((c) => c.name === "Moradia")?.id || "";

  useEffect(() => {
    const categoryFilter = filters.category || defaultCategoryId;

    if (filters.monthReference && filters.yearReference) {
      fetchHousingBills({ ...filters, category: categoryFilter });
    }
  }, [
    filters.monthReference,
    filters.yearReference,
    filters.minValue,
    filters.maxValue,
  ]);

  // Filtro local por texto
  const filteredBills = useMemo(() => {
    if (!filters.searchTerm || !filters.searchField) return housingBills;

    const searchTerm = filters.searchTerm.toLowerCase();

    return housingBills.filter((bill) => {
      switch (filters.searchField) {
        case "name":
          return bill.name?.toLowerCase().includes(searchTerm);
        case "category":
          return bill.categoryName?.toLowerCase().includes(searchTerm);
        default:
          return true;
      }
    });
  }, [housingBills, filters.searchTerm, filters.searchField]);

  const applyFilters = useCallback(() => {
    if (filters.monthReference && filters.yearReference) {
      debugFilters(filters, "HousingBills Manual Apply");
      fetchHousingBills(filters);
    }
  }, [filters, fetchHousingBills]);

  const resetToDefault = useCallback(() => {
    console.log("🔄 Resetando filtros de housing bills para padrão");
    resetFilters();
    clearError();
  }, [resetFilters, clearError]);

  return {
    filters,
    housingBills: filteredBills,
    isLoading,
    error,
    setFilters,
    setFilter,
    resetFilters: resetToDefault,
    applyFilters,
    clearError,
    hasActiveFilters: !!(
      filters.category ||
      filters.minValue ||
      filters.maxValue ||
      filters.searchTerm
    ),
    totalAmount: filteredBills.reduce((sum, b) => sum + (b.amount || 0), 0),
  };
};
