import {
  Calendar,
  LayoutDashboard,
  Home,
  Settings,
  User2,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PieChart,
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
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Receitas", url: "/receitas", icon: TrendingUp },
  { title: "Despesas", url: "/despesas", icon: TrendingDown },
  { title: "Cartões", url: "/cartoes", icon: CreditCard },
  { title: "Moradia", url: "/moradia", icon: Home },
  { title: "Investimentos", url: "/investimentos", icon: PieChart },
  { title: "Calendário", url: "/calendario", icon: Calendar },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup className="h-full">
          <SidebarGroupLabel className="my-4 flex justify-center font-black">
            FINAPP
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
          <SidebarSeparator className="my-2 2xl:my-4" />
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] border border-sidebar-border bg-sidebar text-sidebar-foreground p-4 rounded-2xl cursor-pointer"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
