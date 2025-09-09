// stores/filtersStore.ts - REFORMULADO
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Filters = {
  monthReference: number;
  yearReference: number;
  category: string;
  card: string;
  minValue: string;
  maxValue: string;
  searchField: string;
  searchTerm: string;
};

type FiltersStore = {
  filters: Filters;
  setFilters: (filters: Partial<Filters>) => void;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;
  getDefaultFilters: () => Filters;
};

const getDefaultFilters = (): Filters => {
  const today = new Date();
  return {
    monthReference: today.getMonth() + 1,
    yearReference: today.getFullYear(),
    category: "",
    card: "cmf8p8s45000rgisgz387jrxq", // Cartão principal
    minValue: "",
    maxValue: "",
    searchField: "",
    searchTerm: "",
  };
};

export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set, get) => ({
      filters: getDefaultFilters(),

      setFilters: (updated) =>
        set((state) => ({
          filters: { ...state.filters, ...updated },
        })),

      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      resetFilters: () => set({ filters: getDefaultFilters() }),

      getDefaultFilters,
    }),
    {
      name: "transaction-filters",
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);
