import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CopyButton } from "@/components/shared/CopyButton";
import { getMidenClient } from "@/lib/midenClient";
import { ensureFaucets, resetFaucetCache } from "@/lib/midenFaucets";
import { MIDEN_FAUCETS } from "@/constants/miden-faucets";

/** DEV-ONLY view of the committed Testnet dummy faucets. */
export default function CreateMidenFaucetsPage() {
  const [busy, setBusy] = useState(false);
  const [ids, setIds] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setBusy(true);
    setError(null);
    try {
      const client = await getMidenClient();
      setIds(await ensureFaucets(client));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid max-w-3xl gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Miden faucets</h2>
        <p className="text-sm text-muted-foreground">
          Committed, valueless Testnet faucets for Epoch testing.
        </p>
      </div>
      <Alert>
        <AlertTitle>Stable Testnet assets</AlertTitle>
        <AlertDescription>
          These accounts are already deployed. This page imports their committed
          account files; it never creates replacement faucets.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>Load faucet ids</CardTitle>
          <CardDescription>
            Verify the accounts available to this browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={() => void load()} disabled={busy}>
            {busy && <Loader2 className="animate-spin" />}
            {busy ? "Loading…" : "Load faucets"}
          </Button>
          <Button variant="outline" onClick={resetFaucetCache} disabled={busy}>
            Retry import
          </Button>
        </CardContent>
      </Card>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Import failed</AlertTitle>
          <AlertDescription className="font-mono text-xs">
            {error}
          </AlertDescription>
        </Alert>
      )}
      {ids && (
        <Card>
          <CardHeader>
            <CardTitle>Faucet ids</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {MIDEN_FAUCETS.map((faucet) => (
              <div
                key={faucet.symbol}
                className="flex items-center gap-2 text-xs"
              >
                <span className="w-16 font-medium">{faucet.symbol}</span>
                <span className="flex-1 truncate font-mono text-muted-foreground">
                  {ids[faucet.symbol]}
                </span>
                <CopyButton
                  value={ids[faucet.symbol] ?? ""}
                  label={`Copy ${faucet.symbol} id`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
