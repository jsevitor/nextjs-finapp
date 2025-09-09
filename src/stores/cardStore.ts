import { create } from "zustand";

export type Card = {
  id: string;
  name: string;
  closingDate: number;
  dueDay: number;
  userId: string;
};

export type CardStore = {
  cards: Card[];
  isLoading: boolean;
  error: string | null;
  fetchCards: () => Promise<void>;
  addCard: (card: Card) => Promise<void>;
  removeCard: (id: string) => Promise<void>;
  updateCard: (card: Card) => Promise<void>;
};

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  isLoading: false,
  error: null,

  fetchCards: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/cartoes");
      const data = await response.json();
      set({ cards: data });
    } catch (error) {
      console.error("Erro ao buscar cartões:", error);
      set({ error: "Erro ao buscar cartões" });
    } finally {
      set({ isLoading: false });
    }
  },

  addCard: async (card: Card) => {
    try {
      const response = await fetch("/api/cartoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(card),
      });
      const data = await response.json();
      set({ cards: [...get().cards, data] });
    } catch (error) {
      console.error("Erro ao adicionar cartão:", error);
      set({ error: "Erro ao adicionar cartão" });
    }
  },

  updateCard: async (card: Card) => {
    try {
      const response = await fetch(`/api/cartoes/${card.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(card),
      });
      const data = await response.json();
      set({ cards: get().cards.map((c) => (c.id === card.id ? data : c)) });
    } catch (error) {
      console.error("Erro ao atualizar cartão:", error);
      set({ error: "Erro ao atualizar cartão" });
    }
  },

  removeCard: async (id: string) => {
    try {
      await fetch(`/api/cartoes/${id}`, { method: "DELETE" });
      set({ cards: get().cards.filter((card) => card.id !== id) });
    } catch (error) {
      console.error("Erro ao remover cartão:", error);
      set({ error: "Erro ao remover cartão" });
    }
  },
}));
