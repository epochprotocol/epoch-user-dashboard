import { NavLink, useLocation } from "react-router-dom";
import { Droplets, LayoutDashboard, Undo2, Wallet } from "lucide-react";
import epochLogo from "@/assets/epoch-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Faucets", url: "/faucets", icon: Droplets },
  { title: "My Funds", url: "/funds", icon: Wallet },
  { title: "Reclaim", url: "/reclaim", icon: Undo2 },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <img
            src={epochLogo}
            alt="Epoch"
            className="size-8 shrink-0 object-contain"
          />
          <div className="grid leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-semibold">Epoch</span>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    render={<NavLink to={item.url} />}
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
