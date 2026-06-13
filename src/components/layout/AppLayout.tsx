import { Outlet, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "./AppSidebar";
import { WalletConnect } from "../WalletConnect";

const PAGE_TITLES: Record<string, string> = {
  "/": "Overview",
  "/faucets": "Faucets",
  "/funds": "My Funds",
};

export function AppLayout() {
  const { pathname } = useLocation();
  const { address } = useAccount();
  const hasSession = useMemo(
    () => (address ? !!localStorage.getItem(`session-${address}`) : false),
    [address],
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm font-medium">
            {PAGE_TITLES[pathname] ?? "Epoch Dashboard"}
          </h1>
          <div className="ml-auto">
            <WalletConnect hasSession={hasSession} />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
