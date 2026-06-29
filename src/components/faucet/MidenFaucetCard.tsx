import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
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
import { useMidenFaucetMint } from "@/hooks/useMidenFaucetMint";
import {
  isValidMidenId,
  MIDEN_TESTNET_EXPLORER_URL,
  type MidenFaucetConfig,
} from "@/constants/miden-faucets";

const PRESET_AMOUNTS = ["100", "500", "1000"];

interface MidenFaucetCardProps {
  faucet: MidenFaucetConfig;
  /** Recipient Miden account id (hex), shared across all cards. */
  recipientId: string;
}

export function MidenFaucetCard({ faucet, recipientId }: MidenFaucetCardProps) {
  const { mint, isMinting } = useMidenFaucetMint(faucet);
  const [amount, setAmount] = useState("100");

  const recipientValid = isValidMidenId(recipientId);
  const faucetId = faucet.faucetId;
  const explorerUrl = faucetId
    ? `${MIDEN_TESTNET_EXPLORER_URL.replace(/\/$/, "")}/account/${faucetId}`
    : undefined;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{faucet.symbol}</CardTitle>
          <Badge variant="outline">{faucet.decimals} decimals</Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          {faucetId ? (
            <>
              <span className="truncate font-mono text-xs" title={faucetId}>
                {faucetId.slice(0, 10)}…{faucetId.slice(-6)}
              </span>
              <CopyButton
                value={faucetId}
                label={`Copy ${faucet.symbol} faucet id`}
              />
            </>
          ) : (
            <span className="font-mono text-xs">derived from seed</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
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
          onClick={() => void mint(amount, recipientId.trim())}
          disabled={
            isMinting || !recipientValid || !amount || isNaN(Number(amount))
          }
        >
          {isMinting && <Loader2 className="animate-spin" />}
          {isMinting ? "Minting…" : `Mint ${faucet.symbol}`}
        </Button>
        {!recipientValid && (
          <p className="text-xs text-muted-foreground">
            Enter your Miden account id above to mint.
          </p>
        )}
      </CardContent>
      {explorerUrl && (
        <CardFooter className="justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            render={
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer" />
            }
          >
            Explorer
            <ExternalLink data-icon="inline-end" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
