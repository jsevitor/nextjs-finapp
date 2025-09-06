"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import SessionSync from "./SessionSync";

type Props = {
  children: ReactNode;
};

export default function AuthSessionProvider({ children }: Props) {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  );
}
