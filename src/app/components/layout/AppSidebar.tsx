"use client";

import {
  Calendar,
  LayoutDashboard,
  Settings,
  User2,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PieChart,
  LogOut,
  House,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useSessionStore } from "@/stores/sessionStore";
import UserAvatar from "../common/UserAvatar";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

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

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup className="h-full">
          <SidebarGroupLabel className="my-4 flex justify-center font-black text-2xl transition-all duration-200">
            <span className="group-data-[collapsible=icon]:hidden">FINAPP</span>
            <span className="hidden group-data-[collapsible=icon]:inline">
              F
            </span>
          </SidebarGroupLabel>

          <SidebarSeparator className="my-2 2xl:my-4" />
          <SidebarGroupContent>
            <SidebarMenu className="text-lg">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size={"xl"}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarTrigger className="w-full group-data-[collapsible=icon]:justify-center group-data-[state=expanded]:justify-end" />

          <SidebarSeparator className="my-2 2xl:my-4" />
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                  <UserAvatar url={user?.image ?? ""} />
                  <span>{user?.name}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] border border-sidebar-border bg-sidebar text-sidebar-foreground p-2 rounded-2xl cursor-pointer"
              >
                <DropdownMenuItem>
                  <Button variant={"ghost"} onClick={() => signOut()}>
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
