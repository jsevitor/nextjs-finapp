// src/stores/housingBillsStore.ts
import { create } from "zustand";
import { Filters } from "./filtersStore";

export type HousingBill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  categoryId?: string | null;
  profileId?: string | null;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  categoryName?: string | null;
  profileName?: string | null;
  monthReference?: number;
  yearReference?: number;
};

type HousingBillsStore = {
  housingBills: HousingBill[];
  isLoading: boolean;
  error: string | null;
  lastFetchFilters: Partial<Filters> | null;

  fetchHousingBills: (filters: Filters) => Promise<void>;
  addHousingBill: (bill: Omit<HousingBill, "id">) => Promise<void>;
  updateHousingBill: (bill: HousingBill) => Promise<void>;
  removeHousingBill: (id: string) => Promise<void>;
  clearHousingBills: () => void;
  clearError: () => void;
};

export const useHousingBillsStore = create<HousingBillsStore>((set, get) => ({
  housingBills: [],
  isLoading: false,
  error: null,
  lastFetchFilters: null,

  fetchHousingBills: async (filters: Filters) => {
    const currentState = get();
    if (
      currentState.lastFetchFilters &&
      JSON.stringify(currentState.lastFetchFilters) === JSON.stringify(filters)
    )
      return;

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
      if (filters.minValue) params.append("minValue", filters.minValue);
      if (filters.maxValue) params.append("maxValue", filters.maxValue);

      const url = `/api/moradia?${params.toString()}`;
      console.log("🔍 Buscando contas de moradia:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Formato de resposta inválido");
      }

      const normalizedBills = data.map((hb: any) => ({
        ...hb,
        amount: Number(hb.amount) || 0,
        name: hb.name || "",
        categoryId: hb.categoryId || null,
        profileId: hb.profileId || null,
      }));

      set({
        housingBills: normalizedBills,
        isLoading: false,
        lastFetchFilters: { ...filters },
      });

      console.log("✅ Contas de moradia carregadas:", normalizedBills.length);
    } catch (error) {
      console.error("❌ Erro ao buscar contas de moradia:", error);
      set({
        housingBills: [],
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  },

  addHousingBill: async (bill) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/moradia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bill),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao adicionar conta");
      }

      const newBill = await response.json();
      set((state) => ({
        housingBills: [...state.housingBills, newBill],
        isLoading: false,
      }));

      console.log("✅ Conta de moradia adicionada:", newBill);
    } catch (error) {
      console.error("❌ Erro ao adicionar conta:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
      throw error;
    }
  },

  updateHousingBill: async (bill) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/moradia/${bill.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bill),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao atualizar conta");
      }

      const updatedBill = await response.json();
      set((state) => ({
        housingBills: state.housingBills.map((hb) =>
          hb.id === bill.id ? updatedBill : hb
        ),
        isLoading: false,
      }));

      console.log("✅ Conta de moradia atualizada:", updatedBill);
    } catch (error) {
      console.error("❌ Erro ao atualizar conta:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
      throw error;
    }
  },

  removeHousingBill: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/moradia/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao remover conta");
      }

      set((state) => ({
        housingBills: state.housingBills.filter((hb) => hb.id !== id),
        isLoading: false,
      }));

      console.log("✅ Conta de moradia removida:", id);
    } catch (error) {
      console.error("❌ Erro ao remover conta:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
      throw error;
    }
  },

  clearHousingBills: () => {
    set({ housingBills: [], error: null, lastFetchFilters: null });
  },

  clearError: () => set({ error: null }),
}));
