import { useState } from "react";
import { erc20Abi, formatUnits } from "viem";
import { useAccount, useChainId, useReadContract, useWatchAsset } from "wagmi";
import { ExternalLink, Loader2, WalletMinimal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/shared/CopyButton";
import { useFaucetMint } from "@/hooks/useFaucetMint";
import { getChainsFromGraph, type TokenInfo } from "../../config/web3";

const PRESET_AMOUNTS = ["100", "1000", "10000"];

interface EvmFaucetCardProps {
  token: TokenInfo;
}

export function EvmFaucetCard({ token }: EvmFaucetCardProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { mint, isMinting } = useFaucetMint(token);
  const { watchAsset, isPending: isWatching } = useWatchAsset();
  const [amount, setAmount] = useState("100");

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: token.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, staleTime: 10_000 },
  });

  const explorer = getChainsFromGraph(chainId).find(
    (c) => c.chainId === chainId,
  )?.explorer;
  const explorerTokenUrl = explorer
    ? `${explorer.replace(/\/$/, "")}/token/${token.address}`
    : undefined;

  const formattedBalance =
    balance !== undefined
      ? parseFloat(formatUnits(balance, token.decimals)).toLocaleString(
          undefined,
          { maximumFractionDigits: 4 },
        )
      : "—";

  const handleAddToWallet = () => {
    watchAsset({
      type: "ERC20",
      options: {
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{token.symbol}</CardTitle>
          <Badge variant="outline">{token.decimals} decimals</Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <span className="truncate font-mono text-xs" title={token.address}>
            {token.address.slice(0, 10)}…{token.address.slice(-6)}
          </span>
          <CopyButton
            value={token.address}
            label={`Copy ${token.symbol} address`}
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <p className="text-xs text-muted-foreground">
          Wallet balance:{" "}
          <span className="font-mono text-foreground">
            {formattedBalance} {token.symbol}
          </span>
        </p>
        <div className="flex gap-1.5">
          {PRESET_AMOUNTS.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant={amount === preset ? "secondary" : "outline"}
              size="xs"
              onClick={() => setAmount(preset)}
              disabled={isMinting}
            >
              {Number(preset).toLocaleString()}
            </Button>
          ))}
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Custom"
            className="h-6 flex-1 text-xs"
            disabled={isMinting}
          />
        </div>
        <Button
          onClick={() => void mint(amount, () => void refetchBalance())}
          disabled={isMinting || !address || !amount || isNaN(Number(amount))}
        >
          {isMinting && <Loader2 className="animate-spin" />}
          {isMinting ? "Minting…" : `Mint ${token.symbol}`}
        </Button>
      </CardContent>
      <CardFooter className="justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAddToWallet}
          disabled={isWatching}
        >
          <WalletMinimal data-icon="inline-start" />
          Add to wallet
        </Button>
        {explorerTokenUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            render={
              <a
                href={explorerTokenUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Explorer
            <ExternalLink data-icon="inline-end" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
