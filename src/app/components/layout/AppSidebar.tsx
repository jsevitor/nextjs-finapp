"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  House,
  PieChart,
  CreditCard,
  Calendar,
  Settings,
  ChevronUp,
  LogOut,
  Menu as MenuIcon,
} from "lucide-react";
import { useSessionStore } from "@/stores/sessionStore";
import UserAvatar from "../common/UserAvatar";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

import * as Dialog from "@radix-ui/react-dialog";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Receitas", url: "/receitas", icon: TrendingUp },
  { title: "Transações", url: "/transacoes", icon: TrendingDown },
  { title: "Despesas Moradia", url: "/despesas-moradia", icon: House },
  { title: "Despesas Gerais", url: "/despesas-gerais", icon: PieChart },
  { title: "Cartões", url: "/cartoes", icon: CreditCard },
  { title: "Calendário", url: "/calendario", icon: Calendar },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { user } = useSessionStore((state) => state.session);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* ---------------- TOPBAR ---------------- */}
      <header className="fixed top-0 left-0 right-0 bg-sidebar text-sidebar-foreground h-14 flex items-center justify-between px-4 shadow-md z-50">
        <span className="font-black text-xl">FINAPP</span>

        {/* Hamburger apenas no mobile */}
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </Button>
      </header>

      {/* ---------------- MOBILE DRAWER ---------------- */}
      <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 md:hidden" />

          <Dialog.Content className="fixed top-0 left-0 h-full w-64 bg-sidebar text-sidebar-foreground p-4 z-50 md:hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="font-black text-2xl">FINAPP</span>
              <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
                ✕
              </Button>
            </div>

            <nav className="flex flex-col gap-3">
              {items.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-hover transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              ))}
            </nav>

            <div className="flex-1" />

            <div className="mt-4 border-t border-sidebar-border pt-4">
              <div className="flex items-center gap-2">
                <UserAvatar url={user?.image ?? ""} />
                <span className="text-sm font-medium">{user?.name}</span>
                <ChevronUp className="ml-auto" />
              </div>
              <Button
                variant="ghost"
                className="w-full mt-2 justify-start"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ---------------- DESKTOP MENU ---------------- */}
      <aside className="hidden md:flex fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-sidebar text-sidebar-foreground flex-col p-4">
        <nav className="flex flex-col gap-3">
          {items.map((item) => (
            <a
              key={item.title}
              href={item.url}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-hover transition-colors"
            >
              <item.icon />
              <span>{item.title}</span>
            </a>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="mt-4 border-t border-sidebar-border pt-4">
          <div className="flex items-center gap-2">
            <UserAvatar url={user?.image ?? ""} />
            <span className="text-sm font-medium">{user?.name}</span>
            <ChevronUp className="ml-auto" />
          </div>
          <Button
            variant="ghost"
            className="w-full mt-2 justify-start"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* ---------------- ESPAÇAMENTO PARA CONTEÚDO ---------------- */}
      <div className="pt-14 md:pl-64" />
    </>
  );
}
