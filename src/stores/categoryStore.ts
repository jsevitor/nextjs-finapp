import { create } from "zustand";

export type Category = {
  id: string;
  name: string;
};

type CategoryStore = {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/categorias");
      const data = await res.json();
      set({ categories: data, isLoading: false });
    } catch (err) {
      set({ error: "Erro ao carregar categorias", isLoading: false });
    }
  },

  addCategory: async (name: string) => {
    try {
      const res = await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const newCategory = await res.json();
      set({ categories: [...get().categories, newCategory] });
    } catch (err) {
      set({ error: "Erro ao adicionar categoria" });
    }
  },

  removeCategory: async (id: string) => {
    try {
      await fetch(`/api/categoriaWAs/${id}`, { method: "DELETE" });
      set({
        categories: get().categories.filter((cat) => cat.id !== id),
      });
    } catch (err) {
      set({ error: "Erro ao remover categoria" });
    }
  },
}));
