// stores/transactionsStore.ts - REFORMULADO
import { create } from "zustand";
import { Filters } from "./filtersStore";

export type Transaction = {
  id: string;
  date: string;
  business?: string | null;
  description?: string | null;
  amount: number;
  cardId: string;
  profileId: string;
  categoryId: string;
  installmentNumber?: number;
  installmentTotal?: number;
  parentId?: string | null;
  categoryName?: string | null;
  cardName?: string | null;
  profileName?: string | null;
  monthReference?: number;
  yearReference?: number;
};

type TransactionsStore = {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  lastFetchFilters: Partial<Filters> | null;

  fetchTransactions: (filters: Filters) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  importTransactions: (
    transactions: Omit<Transaction, "id">[]
  ) => Promise<void>;
  clearTransactions: () => void;
  clearError: () => void;
};

export const useTransactionsStore = create<TransactionsStore>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,
  lastFetchFilters: null,

  fetchTransactions: async (filters: Filters) => {
    // Evita refetch desnecessário se os filtros não mudaram
    const currentState = get();
    if (
      currentState.lastFetchFilters &&
      JSON.stringify(currentState.lastFetchFilters) === JSON.stringify(filters)
    ) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Validação dos filtros obrigatórios
      if (!filters.monthReference || !filters.yearReference) {
        throw new Error("Mês e ano são obrigatórios para a busca");
      }

      const params = new URLSearchParams({
        monthReference: String(filters.monthReference),
        yearReference: String(filters.yearReference),
      });

      // Adiciona filtros opcionais apenas se tiverem valor
      if (filters.card) params.append("card", filters.card);
      if (filters.category) params.append("category", filters.category);
      if (filters.minValue) params.append("minValue", filters.minValue);
      if (filters.maxValue) params.append("maxValue", filters.maxValue);

      const url = `/api/transacoes?${params.toString()}`;
      console.log("🔍 Buscando transações:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Formato de resposta inválido");
      }

      // Normaliza os dados
      const normalizedTransactions = data.map((t: any) => ({
        ...t,
        amount: Number(t.amount) || 0,
        installmentNumber: t.installmentNumber || 1,
        installmentTotal: t.installmentTotal || 1,
        date: t.date,
        business: t.business || null,
        description: t.description || null,
        parentId: t.parentId || null,
      }));

      set({
        transactions: normalizedTransactions,
        isLoading: false,
        lastFetchFilters: { ...filters },
      });

      console.log("✅ Transações carregadas:", normalizedTransactions.length);
    } catch (error) {
      console.error("❌ Erro ao buscar transações:", error);
      set({
        transactions: [],
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  },

  addTransaction: async (transactionData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/transacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao adicionar transação");
      }

      const newTransaction = await response.json();

      set((state) => ({
        transactions: [...state.transactions, newTransaction],
        isLoading: false,
      }));

      console.log("✅ Transação adicionada:", newTransaction);
    } catch (error) {
      console.error("❌ Erro ao adicionar transação:", error);
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro ao adicionar transação",
      });
      throw error;
    }
  },

  updateTransaction: async (transaction) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/transacoes/${transaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar transação");
      }

      const updatedTransaction = await response.json();

      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === transaction.id ? updatedTransaction : t
        ),
        isLoading: false,
      }));

      console.log("✅ Transação atualizada:", updatedTransaction);
    } catch (error) {
      console.error("❌ Erro ao atualizar transação:", error);
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro ao atualizar transação",
      });
      throw error;
    }
  },

  removeTransaction: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/transacoes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao remover transação");
      }

      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        isLoading: false,
      }));

      console.log("✅ Transação removida:", id);
    } catch (error) {
      console.error("❌ Erro ao remover transação:", error);
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Erro ao remover transação",
      });
      throw error;
    }
  },

  importTransactions: async (transactions) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/transacoes/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactions),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro na importação");
      }

      set({ isLoading: false });
      console.log("✅ Transações importadas com sucesso");
    } catch (error) {
      console.error("❌ Erro ao importar transações:", error);
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro ao importar transações",
      });
      throw error;
    }
  },

  clearTransactions: () => {
    set({ transactions: [], error: null, lastFetchFilters: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
