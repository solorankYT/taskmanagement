import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { type NavItem } from "@/types";
import { Link } from "@inertiajs/react";
import {
  LayoutGrid,
  ListTodo,
  FolderKanban,
  Timer,
  BarChart3,
  Settings,
} from "lucide-react";
import AppLogo from "./app-logo";

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { title: "Boards", href: "/boards", icon: FolderKanban },
];

const productivityItems: NavItem[] = [
  { title: "Pomodoro Timer", href: "/pomodoro", icon: Timer },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
];



export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex overflow-hidden">
        <NavMain items={mainNavItems} />
        <SidebarSeparator />
        <NavMain  items={productivityItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
