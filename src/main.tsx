import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import "./index.css";
import FaucetsPage from "./pages/FaucetsPage.tsx";
import FundsPage from "./pages/FundsPage.tsx";
import OverviewPage from "./pages/OverviewPage.tsx";
import { AppLayout } from "./components/layout/AppLayout";
import { Toaster } from "@/components/ui/sonner";
import { config } from "./config/wagmi";
import { NotificationProvider } from "./context/NotificationProvider";
import { ChainConfigProvider } from "./contexts/ChainConfigContext";
import { useChainConfig as useChainConfigQuery } from "./hooks/useChainConfig";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

const customTheme = darkTheme({
  accentColor: "#16e07f",
  accentColorForeground: "#04150c",
  borderRadius: "medium",
  overlayBlur: "small",
});

// Component to provide chain config context using react-query hook
function ChainConfigWrapper({ children }: { children: React.ReactNode }) {
  const { supportedChains } = useChainConfigQuery();
  return (
    <ChainConfigProvider value={{ supportedChains: supportedChains ?? null }}>
      {children}
    </ChainConfigProvider>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>
          <ChainConfigWrapper>
            <NotificationProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route index element={<OverviewPage />} />
                    <Route path="/faucets" element={<FaucetsPage />} />
                    <Route path="/funds" element={<FundsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </BrowserRouter>
              <Toaster richColors position="bottom-right" />
            </NotificationProvider>
          </ChainConfigWrapper>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
