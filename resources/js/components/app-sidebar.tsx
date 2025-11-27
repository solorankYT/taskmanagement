import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { type NavItem } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { LayoutGrid, FolderKanban, Timer, BarChart3, ChevronDown } from "lucide-react";
import AppLogo from "./app-logo";
import { Boards } from "@/types/models";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";
import { useSidebar } from "./ui/sidebar";
import { useState } from "react";

interface Props {
  boards?: Boards[];
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutGrid },
];

const productivityItems: NavItem[] = [
  { title: "Pomodoro Timer", href: "/pomodoro", icon: Timer },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function AppSidebar({ boards: initialBoards }: Props) {
  const page = usePage<{ boards?: Boards[] }>();
  const boards = initialBoards ?? page.props.boards ?? [];
  const { state: sidebarState } = useSidebar(); // get sidebar state

  const [userToggled, setUserToggled] = useState(true);
  const boardsOpen = sidebarState === "collapsed" ? false : userToggled;

  const MAX_VISIBLE_BOARDS = 5;
  const visibleBoards = boards.slice(0, MAX_VISIBLE_BOARDS);
  const hasMoreBoards = boards.length > MAX_VISIBLE_BOARDS;

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <Link href="/" prefetch>
          <AppLogo />
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex flex-col overflow-hidden space-y-2">
        <NavMain items={mainNavItems} />
        <SidebarSeparator />
        <NavMain items={productivityItems} />
        <SidebarSeparator />

        <Collapsible open={boardsOpen} onOpenChange={setUserToggled} className="group/collapsible mt-2">
          <SidebarGroup>
            <CollapsibleTrigger className="flex justify-between items-center cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <NavMain
                items={[
                  { title: "Boards", href: "/boards", icon: FolderKanban },
                ]}
              />
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-2">
              {visibleBoards.length > 0 ? (
                <NavMain
                  items={visibleBoards.map((b) => ({
                    title: b.title,
                    href: `/boards/${b.id}`,
                  }))}
                />
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="mb-2 text-sm">You don’t have any boards yet.</p>
                  <Link
                    href="/boards"
                    className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors"
                  >
                    Create a new board
                  </Link>
                </div>
              )}

              {hasMoreBoards && (
                <div className="px-3 py-1">
                  <Link
                    href="/boards"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors flex items-center space-x-1"
                  >
                    <span>View all boards</span>
                  </Link>
                </div>
              )}
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
