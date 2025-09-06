import { create } from "zustand";
import { User } from "next-auth";

type SessionData = {
  user: User | null;
  isAuthenticated: boolean;
};

type SessionStore = {
  session: SessionData;
  setSession: (data: SessionData) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  session: {
    user: null,
    isAuthenticated: false,
  },
  setSession: (data) => set({ session: data }),
  clearSession: () =>
    set({
      session: {
        user: null,
        isAuthenticated: false,
      },
    }),
}));
