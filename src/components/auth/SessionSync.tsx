"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSessionStore } from "@/stores/sessionStore";

export default function SessionSync() {
  const { data: session, status } = useSession();
  const setSession = useSessionStore((state) => state.setSession);
  const clearSession = useSessionStore((state) => state.clearSession);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setSession({
        user: session.user,
        isAuthenticated: true,
      });
    } else if (status === "unauthenticated") {
      clearSession();
    }
  }, [session, status, setSession, clearSession]);

  return null;
}
