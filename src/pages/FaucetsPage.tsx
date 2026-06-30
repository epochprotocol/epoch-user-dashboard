import { useMemo } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import {
  baseSepolia,
  optimismSepolia,
  sepolia,
} from "viem/chains";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EvmFaucetCard } from "@/components/faucet/EvmFaucetCard";
import { MidenFaucetSection } from "@/components/faucet/MidenFaucetSection";
import { getTokensForChain, isTestnetChain } from "../config/web3";
import { getChainName } from "../utils/chains";

const TESTNETS = [sepolia, baseSepolia, optimismSepolia];

export default function FaucetsPage() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const tokens = useMemo(() => getTokensForChain(chainId), [chainId]);
  const onTestnet = isTestnetChain(chainId);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Faucets</CardTitle>
          <CardDescription>
            Connect your wallet to mint epoch test tokens.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Faucets</h2>
        <p className="text-sm text-muted-foreground">
          Mint epoch test tokens to your wallet for trying deposits and
          withdrawals.
        </p>
      </div>

      <Tabs defaultValue="evm">
        <TabsList>
          <TabsTrigger value="evm">EVM tokens</TabsTrigger>
          <TabsTrigger value="miden">Miden</TabsTrigger>
        </TabsList>

        <TabsContent value="evm" className="grid gap-4 pt-2">
          {!onTestnet ? (
            <Alert>
              <TriangleAlert />
              <AlertTitle>Faucets are testnet-only</AlertTitle>
              <AlertDescription>
                <p className="mb-3">
                  You are connected to {getChainName(chainId)}. Switch to a
                  testnet to mint tokens:
                </p>
                <div className="flex flex-wrap gap-2">
                  {TESTNETS.map((chain) => (
                    <Button
                      key={chain.id}
                      variant="outline"
                      size="sm"
                      disabled={isSwitching}
                      onClick={() => switchChain({ chainId: chain.id })}
                    >
                      {chain.name}
                    </Button>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          ) : tokens.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No tokens on {getChainName(chainId)}</CardTitle>
                <CardDescription>
                  The epoch testnet graph has no tokens for this chain. Try
                  another testnet.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tokens.map((token) => (
                <EvmFaucetCard key={token.address} token={token} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="miden" className="pt-2">
          <MidenFaucetSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
