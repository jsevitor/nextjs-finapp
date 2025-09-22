import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./prisma";
import type { NextAuthOptions } from "next-auth";
import { Role, User } from "@prisma/client"; // Importando o tipo User

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as Role) || Role.USER;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Aqui, vamos garantir que user seja do tipo User
        token.role = (user as User).role || Role.USER;
      }
      return token;
    },
  },
};
