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
import {
  MIDEN_FAUCETS,
  MIDEN_FAUCET_SEED,
} from "@/constants/miden-faucets";

/**
 * DEV-ONLY. Creates/derives the faucet accounts from the seed and shows their
 * ids. No account files are stored — the seed (VITE_MIDEN_FAUCET_SEED) regenerates
 * the keys. Gated behind import.meta.env.DEV in main.tsx.
 */
export default function CreateMidenFaucetsPage() {
  const [busy, setBusy] = useState(false);
  const [ids, setIds] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const seedSet = Boolean(MIDEN_FAUCET_SEED);

  const run = async (fresh: boolean) => {
    setBusy(true);
    setError(null);
    setIds(null);
    try {
      if (fresh) resetFaucetCache();
      const client = await getMidenClient();
      setIds(await ensureFaucets(client));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  // {symbol, faucetId} block to paste into MIDEN_FAUCETS for explorer links (optional).
  const idBlock = ids
    ? MIDEN_FAUCETS.map(
        (f) => `  { symbol: "${f.symbol}", faucetId: "${ids[f.symbol] ?? ""}" },`,
      ).join("\n")
    : "";

  return (
    <div className="grid max-w-3xl gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Miden faucets (dev)
        </h2>
        <p className="text-sm text-muted-foreground">
          Create / derive the faucet accounts from the seed. Their ids and keys
          come from <code className="font-mono">VITE_MIDEN_FAUCET_SEED</code> — no
          account files stored.
        </p>
      </div>

      {!seedSet ? (
        <Alert variant="destructive">
          <AlertTitle>No seed configured</AlertTitle>
          <AlertDescription>
            Set <code className="font-mono">VITE_MIDEN_FAUCET_SEED</code> in your{" "}
            <code className="font-mono">.env</code> and restart the dev server.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertTitle>How this works</AlertTitle>
          <AlertDescription>
            Faucets are created in the order of{" "}
            <code className="font-mono">MIDEN_FAUCETS</code> (
            {MIDEN_FAUCETS.map((f) => f.symbol).join(", ")}), each 6 decimals,
            maxSupply {MIDEN_FAUCETS[0]?.maxSupply.toLocaleString()}. The seeded
            client makes the ids + keys reproducible. Creating them deploys on
            first mint.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Derive faucets</CardTitle>
          <CardDescription>
            First run creates them; later runs just re-read the cached ids.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => void run(false)} disabled={busy || !seedSet}>
            {busy && <Loader2 className="animate-spin" />}
            {busy ? "Working…" : "Create / derive faucets"}
          </Button>
          <Button
            variant="outline"
            onClick={() => void run(true)}
            disabled={busy || !seedSet}
          >
            Force re-derive (clear cache)
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Failed</AlertTitle>
          <AlertDescription className="font-mono text-xs">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {ids && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Faucet ids</CardTitle>
              <CopyButton value={idBlock} label="Copy id block" />
            </div>
            <CardDescription>
              Optional: paste into <code className="font-mono">MIDEN_FAUCETS</code>{" "}
              (the <code className="font-mono">faucetId</code> fields) for explorer
              links. Minting does not need this — it derives ids from the seed.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {MIDEN_FAUCETS.map((f) => (
              <div key={f.symbol} className="flex items-center gap-2 text-xs">
                <span className="w-16 font-medium">{f.symbol}</span>
                <span
                  className="flex-1 truncate font-mono text-muted-foreground"
                  title={ids[f.symbol]}
                >
                  {ids[f.symbol]}
                </span>
                <CopyButton value={ids[f.symbol] ?? ""} label={`Copy ${f.symbol} id`} />
              </div>
            ))}
            <pre className="mt-2 max-h-48 overflow-auto rounded bg-muted p-3 font-mono text-xs">
              {idBlock}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
