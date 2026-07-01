import { useState } from "react";
import { Hourglass, Info } from "lucide-react";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MidenFaucetCard } from "@/components/faucet/MidenFaucetCard";
import {
  MIDEN_FAUCETS,
  MIDEN_FAUCETS_CONFIGURED,
} from "@/constants/miden-faucets";

export function MidenFaucetSection() {
  const [recipientId, setRecipientId] = useState("");

  if (!MIDEN_FAUCETS_CONFIGURED) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Miden</CardTitle>
            <Badge variant="outline">non-EVM</Badge>
            <Badge variant="secondary">Setup needed</Badge>
          </div>
          <CardDescription>
            Faucet support for epoch tokens on the Miden testnet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Hourglass className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium">Miden faucet seed not set</p>
            <p className="max-w-md text-xs text-muted-foreground">
              Set <code className="font-mono">VITE_MIDEN_FAUCET_SEED</code> in the
              environment and restart, then create the faucets once at{" "}
              <code className="font-mono">/dev/miden-faucets</code> (dev build).
              See <code className="font-mono">docs/MIDEN_FAUCETS.md</code>.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Mint to your Miden account</CardTitle>
            <Badge variant="outline">non-EVM</Badge>
          </div>
          <CardDescription>
            Paste your Miden account id, then mint any token below. We emit a
            public note to your account — sync your Miden wallet to consume it.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Label htmlFor="miden-recipient">Your Miden account id</Label>
          <Input
            id="miden-recipient"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            placeholder="0x…"
            className="font-mono"
          />
          <Alert>
            <Info />
            <AlertTitle>Testnet faucet</AlertTitle>
            <AlertDescription>
              These are valueless Miden testnet tokens, free to mint. The faucet
              keys are public by design.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MIDEN_FAUCETS.map((faucet) => (
          <MidenFaucetCard
            key={faucet.symbol}
            faucet={faucet}
            recipientId={recipientId}
          />
        ))}
      </div>
    </div>
  );
}
