"use client";

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
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/sessionStore";
import UserAvatar from "../common/UserAvatar";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  House,
  PieChart,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Receitas", url: "/receitas", icon: TrendingUp, restricted: true },
  { title: "Transações", url: "/transacoes", icon: TrendingDown },
  {
    title: "Despesas Moradia",
    url: "/despesas-moradia",
    icon: House,
    restricted: true,
  },
  {
    title: "Despesas Gerais",
    url: "/despesas-gerais",
    icon: PieChart,
    restricted: true,
  },
  { title: "Cartões", url: "/cartoes", icon: CreditCard },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { user } = useSessionStore((state) => state.session);
  const pathname = usePathname();

  // ⚙️ ID ou e-mail que pode ver tudo
  const myEmail = "jvoliveer@gmail.com"; // <-- troque pelo seu
  const isVitor = user?.email === myEmail;

  // 🔒 Filtra menus com base no flag `restricted`
  const filteredItems = items.filter((item) => {
    if (item.restricted && !isVitor) return false;
    return true;
  });

  return (
    <>
      <div className="absolute left-2 top-2 lg:hidden z-50">
        <SidebarTrigger />
      </div>

      <Sidebar
        collapsible="icon"
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-sidebar transition-all",
          "lg:[data-state=collapsed]",
          "2xl:[data-state=expanded]"
        )}
      >
        <SidebarContent>
          <SidebarGroup className="h-full">
            <SidebarGroupLabel className="my-4 flex justify-between font-black text-2xl transition-all duration-200">
              <span className="group-data-[collapsible=icon]:hidden text-sidebar-accent-foreground">
                FINAPP
              </span>
              <SidebarTrigger className="group-data-[collapsible=icon]:justify-start group-data-[state=expanded]:justify-end hidden lg:flex" />
            </SidebarGroupLabel>

            <SidebarSeparator className="my-2 2xl:my-4" />

            <SidebarGroupContent>
              <SidebarMenu>
                {filteredItems.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        size="lg"
                        className={cn(
                          "transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "hover:bg-sidebar-accent/50"
                        )}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>

            <SidebarSeparator className="my-2 2xl:my-4" />
            <SidebarFooter>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="cursor-pointer h-12">
                    <UserAvatar url={user?.image ?? ""} />
                    <span>{user?.name}</span>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width] border border-sidebar-border bg-sidebar text-sidebar-foreground p-2 rounded-2xl cursor-pointer"
                >
                  <DropdownMenuItem className="w-52 group-data-[collapsible=icon]:w-fit">
                    <Button
                      variant="ghost"
                      className="w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      onClick={() => signOut()}
                    >
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
    </>
  );
}
