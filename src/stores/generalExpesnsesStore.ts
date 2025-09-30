// src/stores/generalExpensesStore.ts
import { create } from "zustand";
import { Filters } from "../app/types/filters";

export type GeneralExpense = {
  id: string;
  description?: string | null;
  business?: string | null;
  amount: number;
  date: string; // ISO string
  dueDay: number;
  categoryId?: string | null;
  profileId?: string | null;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  categoryName?: string | null;
  profileName?: string | null;
  monthReference?: number;
  yearReference?: number;
  installmentNumber?: number | null;
  installmentTotal?: number | null;
  parentId?: string | null;
};

type GeneralExpensesStore = {
  generalExpenses: GeneralExpense[];
  isLoading: boolean;
  error: string | null;
  lastFetchFilters: Partial<Filters> | null;

  fetchGeneralExpenses: (filters: Filters) => Promise<void>;
  addGeneralExpense: (
    expense: Omit<GeneralExpense, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateGeneralExpense: (expense: GeneralExpense) => Promise<void>;
  removeGeneralExpense: (id: string) => Promise<void>;
  clearGeneralExpenses: () => void;
  clearError: () => void;
};

export const useGeneralExpensesStore = create<GeneralExpensesStore>(
  (set, get) => ({
    generalExpenses: [],
    isLoading: false,
    error: null,
    lastFetchFilters: null,

    fetchGeneralExpenses: async (filters: Filters) => {
      const currentState = get();
      if (
        currentState.lastFetchFilters &&
        JSON.stringify(currentState.lastFetchFilters) ===
          JSON.stringify(filters)
      ) {
        return;
      }

      set({ isLoading: true, error: null });

      try {
        if (!filters.monthReference || !filters.yearReference) {
          throw new Error("Mês e ano são obrigatórios para a busca");
        }

        const params = new URLSearchParams({
          monthReference: String(filters.monthReference),
          yearReference: String(filters.yearReference),
        });

        if (filters.category) params.append("category", filters.category);

        // CORREÇÃO AQUI - verificar se minValue e maxValue são números válidos
        if (typeof filters.minValue === "number" && !isNaN(filters.minValue)) {
          params.append("minValue", String(filters.minValue));
        }

        if (typeof filters.maxValue === "number" && !isNaN(filters.maxValue)) {
          params.append("maxValue", String(filters.maxValue));
        }

        const url = `/api/despesas-gerais?${params.toString()}`;
        console.log("🔍 Buscando despesas gerais:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
        }

        const data: GeneralExpense[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Formato de resposta inválido");
        }

        const normalizedExpenses = data.map((ge) => ({
          ...ge,
          amount: Number(ge.amount) || 0,
          description: ge.description ?? null,
          business: ge.business ?? null,
          categoryId: ge.categoryId ?? null,
          profileId: ge.profileId ?? null,
        }));

        set({
          generalExpenses: normalizedExpenses,
          isLoading: false,
          lastFetchFilters: { ...filters },
        });

        console.log(
          "✅ Despesas gerais carregadas:",
          normalizedExpenses.length
        );
      } catch (error) {
        console.error("❌ Erro ao buscar despesas gerais:", error);
        set({
          generalExpenses: [],
          isLoading: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    },

    addGeneralExpense: async (expense) => {
      set({ isLoading: true, error: null });
      try {
        const normalizedExpense = {
          ...expense,
          categoryId:
            expense.categoryId && expense.categoryId !== ""
              ? expense.categoryId
              : null,
          profileId:
            expense.profileId && expense.profileId !== ""
              ? expense.profileId
              : null,
        };

        const response = await fetch("/api/despesas-gerais", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizedExpense),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Erro ao adicionar despesa");
        }

        const payload = await response.json();

        const createdArray: GeneralExpense[] = Array.isArray(payload)
          ? payload
          : [payload];

        const normalized = createdArray.map((ge) => ({
          ...ge,
          amount: Number(ge.amount) || 0,
          description: ge.description ?? null,
          business: ge.business ?? null,
          categoryId: ge.categoryId ?? null,
          profileId: ge.profileId ?? null,
        }));

        set((state) => ({
          generalExpenses: [...state.generalExpenses, ...normalized],
          isLoading: false,
        }));

        console.log(
          "✅ Despesa(s) geral(is) adicionada(s):",
          normalized.length
        );
      } catch (error) {
        console.error("❌ Erro ao adicionar despesa:", error);
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        });
        throw error;
      }
    },

    updateGeneralExpense: async (expense) => {
      set({ isLoading: true, error: null });
      try {
        const normalizedExpense = {
          ...expense,
          categoryId:
            expense.categoryId && expense.categoryId !== ""
              ? expense.categoryId
              : null,
          profileId:
            expense.profileId && expense.profileId !== ""
              ? expense.profileId
              : null,
        };

        const response = await fetch(`/api/despesas-gerais/${expense.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizedExpense),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Erro ao atualizar despesa");
        }

        const updatedExpense: GeneralExpense = await response.json();
        set((state) => ({
          generalExpenses: state.generalExpenses.map((ge) =>
            ge.id === expense.id ? { ...ge, ...updatedExpense } : ge
          ),
          isLoading: false,
        }));

        console.log("✅ Despesa geral atualizada:", updatedExpense);
      } catch (error) {
        console.error("❌ Erro ao atualizar despesa:", error);
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        });
        throw error;
      }
    },

    removeGeneralExpense: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`/api/despesas-gerais/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Erro ao remover despesa");
        }

        set((state) => ({
          generalExpenses: state.generalExpenses.filter((ge) => ge.id !== id),
          isLoading: false,
        }));

        console.log("✅ Despesa geral removida:", id);
      } catch (error) {
        console.error("❌ Erro ao remover despesa:", error);
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        });
        throw error;
      }
    },

    clearGeneralExpenses: () => {
      set({ generalExpenses: [], error: null, lastFetchFilters: null });
    },

    clearError: () => set({ error: null }),
  })
);
