"use client";

import { Session, User } from "next-auth";
import { useEffect } from "react";
import { useSessionStore } from "@/stores/sessionStore";

type Props = {
  session: Session | null;
};

export default function SessionInitializer({ session }: Props) {
  const setSession = useSessionStore((state) => state.setSession);

  useEffect(() => {
    if (session) {
      setSession({
        user: (session?.user ?? null) as User | null,
        isAuthenticated: true,
      });
    }
  }, [session, setSession]);

  return null;
}
