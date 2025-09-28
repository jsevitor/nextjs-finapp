import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Filters } from "@/app/types/filters";

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
    monthReference: today.getMonth() + 2,
    yearReference: today.getFullYear(),
    category: "",
    profile: "",
    card: "cmf8p8s45000rgisgz387jrxq",
    minValue: null,
    maxValue: null,
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
      name: "app-filters",
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);
