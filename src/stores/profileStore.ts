// src/stores/profileStore.ts
import { create } from "zustand";

export type Profile = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
};

type ProfileStore = {
  profiles: Profile[];
  isLoading: boolean;
  error: string | null;
  fetchProfiles: () => Promise<void>;
  addProfile: (profile: Omit<Profile, "id" | "createdAt">) => Promise<void>;
  updateProfile: (profile: Profile) => Promise<void>;
  removeProfile: (id: string) => Promise<void>;
};

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profiles: [],
  isLoading: false,
  error: null,

  fetchProfiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/perfil");
      const data = await res.json();
      set({ profiles: data });
    } catch (error) {
      console.error("Erro ao buscar perfis:", error);
      set({ error: "Erro ao buscar perfis." });
    } finally {
      set({ isLoading: false });
    }
  },

  addProfile: async (profile) => {
    try {
      const res = await fetch("/api/perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Erro ao adicionar perfil");

      const newProfile = await res.json();
      set({ profiles: [...get().profiles, newProfile] });
    } catch (error) {
      console.error("Erro ao adicionar perfil:", error);
      set({ error: "Erro ao adicionar perfil." });
    }
  },

  updateProfile: async (profile) => {
    try {
      const res = await fetch(`/api/perfil/${profile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Erro ao atualizar perfil");

      const updated = await res.json();
      set({
        profiles: get().profiles.map((p) =>
          p.id === updated.id ? updated : p
        ),
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      set({ error: "Erro ao atualizar perfil." });
    }
  },

  removeProfile: async (id) => {
    try {
      const res = await fetch(`/api/perfil/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao remover perfil");

      set({ profiles: get().profiles.filter((p) => p.id !== id) });
    } catch (error) {
      console.error("Erro ao remover perfil:", error);
      set({ error: "Erro ao remover perfil." });
    }
  },
}));
