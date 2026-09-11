import { useState } from "react";
import { Info } from "lucide-react";
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
import { MIDEN_FAUCETS } from "@/constants/miden-faucets";

export function MidenFaucetSection() {
  const [recipientId, setRecipientId] = useState("");

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
