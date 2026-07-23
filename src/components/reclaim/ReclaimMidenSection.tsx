import { useState } from "react";
import { formatUnits } from "viem";
import {
  ArrowDownToLine,
  Info,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  TriangleAlert,
  Undo2,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "@/components/shared/CopyButton";
import { useMidenWallet } from "@/hooks/useMidenWallet";
import { useMidenConsumableNotes } from "@/hooks/useMidenConsumableNotes";
import { useMidenReclaim } from "@/hooks/useMidenReclaim";
import { fetchReclaimNote, type ReclaimNoteInfo } from "@/lib/midenReclaim";
import { MIDEN_TESTNET_EXPLORER_URL } from "@/constants/miden-faucets";

const shortId = (id: string) => `${id.slice(0, 10)}…${id.slice(-6)}`;

export function ReclaimMidenSection() {
  const wallet = useMidenWallet();
  const { connected, accountIdHex } = wallet;

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Reclaim stuck Miden notes</CardTitle>
            <Badge variant="outline">non-EVM</Badge>
          </div>
          <CardDescription>
            When a Miden collateral note (P2IDE) is never consumed — an intent
            that didn’t settle — its creator can reclaim the locked assets once
            the note’s reclaim block height passes. Connect the wallet that
            created the note to reclaim it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WalletBar wallet={wallet} />
        </CardContent>
      </Card>

      {connected && (
        <>
          <ConsumableNotesCard
            connected={connected}
            accountIdHex={accountIdHex}
          />
          <ReclaimByIdCard accountIdHex={accountIdHex} />
        </>
      )}
    </div>
  );
}

function WalletBar({ wallet }: { wallet: ReturnType<typeof useMidenWallet> }) {
  const { connected, connecting, connect, disconnect, accountIdHex, address } =
    wallet;

  if (!connected) {
    return (
      <div className="grid gap-3">
        <Alert>
          <Info />
          <AlertTitle>Connect your Miden wallet</AlertTitle>
          <AlertDescription>
            Reclaiming consumes the note back to your account, so it must be
            signed by the wallet that created it.
          </AlertDescription>
        </Alert>
        <Button onClick={() => void connect()} disabled={connecting}>
          {connecting ? <Loader2 className="animate-spin" /> : <Wallet />}
          {connecting ? "Connecting…" : "Connect Miden wallet"}
        </Button>
      </div>
    );
  }

  const shown = accountIdHex ?? address ?? "";
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 overflow-hidden">
        <Wallet className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate font-mono text-xs" title={shown}>
          {shown ? shortId(shown) : "connected"}
        </span>
        {shown && <CopyButton value={shown} label="Copy account id" />}
      </div>
      <Button variant="ghost" size="sm" onClick={() => void disconnect()}>
        <LogOut data-icon="inline-start" />
        Disconnect
      </Button>
    </div>
  );
}

function ConsumableNotesCard({
  connected,
  accountIdHex,
}: {
  connected: boolean;
  accountIdHex: string | null;
}) {
  const { notes, loading, error, refresh, supported } = useMidenConsumableNotes(
    connected,
    accountIdHex,
  );
  const { reclaim, reclaimingId } = useMidenReclaim();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle>Consumable notes</CardTitle>
            <CardDescription>
              Notes your wallet can consume right now. Your own notes coming
              back are reclaims; others are incoming payments you can claim.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refresh()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <RefreshCw data-icon="inline-start" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        {!supported && (
          <Alert>
            <TriangleAlert />
            <AlertTitle>Auto-listing unavailable</AlertTitle>
            <AlertDescription>
              This wallet doesn’t expose consumable notes. Use “Reclaim by note
              id” below.
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>Couldn’t load notes</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {supported && !error && notes.length === 0 && !loading && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No consumable notes. A note only shows here once it’s past its
            reclaim height and not time-locked.
          </p>
        )}
        {notes.map((n) => (
          <div
            key={n.noteId}
            className="flex items-center justify-between gap-2 rounded-md border p-2"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {formatUnits(n.amount, n.decimals)} {n.symbol ?? "tokens"}
                </span>
                <Badge variant={n.isReclaim ? "secondary" : "outline"}>
                  {n.isReclaim ? "Reclaim" : "Claim"}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className="truncate font-mono text-xs text-muted-foreground"
                  title={n.noteId}
                >
                  {shortId(n.noteId)}
                </span>
                <CopyButton value={n.noteId} label="Copy note id" />
              </div>
            </div>
            <Button
              size="sm"
              onClick={() =>
                void reclaim(
                  {
                    noteId: n.noteId,
                    faucetId: n.faucetId ?? "",
                    amount: n.amount,
                    symbol: n.symbol,
                    decimals: n.decimals,
                    isReclaim: n.isReclaim,
                  },
                  () => void refresh(),
                )
              }
              disabled={reclaimingId === n.noteId || !n.faucetId}
            >
              {reclaimingId === n.noteId ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ArrowDownToLine data-icon="inline-start" />
              )}
              {n.isReclaim ? "Reclaim" : "Claim"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ReclaimByIdCard({ accountIdHex }: { accountIdHex: string | null }) {
  const [noteIdInput, setNoteIdInput] = useState("");
  const [looking, setLooking] = useState(false);
  const [result, setResult] = useState<ReclaimNoteInfo | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const { reclaim, reclaimingId } = useMidenReclaim();

  const lookup = async () => {
    const id = noteIdInput.trim();
    if (!id) return;
    setLooking(true);
    setResult(null);
    setLookupError(null);
    try {
      const res = await fetchReclaimNote(id);
      if (res.found) setResult(res.note);
      else setLookupError(res.reason);
    } finally {
      setLooking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reclaim by note id</CardTitle>
        <CardDescription>
          Paste a stuck note id (from Midenscan, the intent, or your records) to
          inspect it and reclaim if you’re the creator and its reclaim height
          has passed.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="reclaim-note-id">Note id</Label>
          <div className="flex gap-2">
            <Input
              id="reclaim-note-id"
              value={noteIdInput}
              onChange={(e) => setNoteIdInput(e.target.value)}
              placeholder="0x…"
              className="font-mono"
            />
            <Button
              variant="outline"
              onClick={() => void lookup()}
              disabled={looking || !noteIdInput.trim()}
            >
              {looking ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Search data-icon="inline-start" />
              )}
              Look up
            </Button>
          </div>
        </div>

        {lookupError && (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>Not found</AlertTitle>
            <AlertDescription>{lookupError}</AlertDescription>
          </Alert>
        )}

        {result && (
          <NoteResult
            note={result}
            accountIdHex={accountIdHex}
            reclaiming={reclaimingId === result.noteId}
            onReclaim={() =>
              void reclaim({
                noteId: result.noteId,
                faucetId: result.faucetId ?? "",
                amount: result.amount,
                symbol: result.symbol,
                decimals: result.decimals,
                isReclaim: true,
              })
            }
          />
        )}
      </CardContent>
    </Card>
  );
}

function NoteResult({
  note,
  accountIdHex,
  reclaiming,
  onReclaim,
}: {
  note: ReclaimNoteInfo;
  accountIdHex: string | null;
  reclaiming: boolean;
  onReclaim: () => void;
}) {
  const me = accountIdHex?.trim().toLowerCase() ?? null;
  const senderIsYou =
    !!me && !!note.senderAccountId && note.senderAccountId.toLowerCase() === me;

  const timelocked =
    note.timelockHeight != null && note.timelockHeight > note.currentBlock;
  const heightPassed =
    note.reclaimHeight != null && note.currentBlock >= note.reclaimHeight;
  const blocksToGo =
    note.reclaimHeight != null ? note.reclaimHeight - note.currentBlock : null;

  const canReclaim =
    note.isP2IDE && heightPassed && !timelocked && !!note.faucetId;

  return (
    <div className="grid gap-3 rounded-md border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-lg font-semibold">
          {formatUnits(note.amount, note.decimals)} {note.symbol ?? "tokens"}
        </span>
        <Badge variant={note.isP2IDE ? "secondary" : "destructive"}>
          {note.isP2IDE ? "P2IDE" : "P2ID"}
        </Badge>
      </div>

      <Separator />

      <dl className="grid gap-1.5 text-sm">
        <Row label="Note id">
          <span className="font-mono text-xs" title={note.noteId}>
            {shortId(note.noteId)}
          </span>
          <a
            href={`${MIDEN_TESTNET_EXPLORER_URL.replace(/\/$/, "")}/note/${note.noteId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline text-muted-foreground"
          >
            explorer
          </a>
        </Row>
        <Row label="Creator">
          <span className="font-mono text-xs">
            {note.senderAccountId ? shortId(note.senderAccountId) : "unknown"}
          </span>
          {senderIsYou && <Badge variant="outline">you</Badge>}
        </Row>
        <Row label="Current block">
          <span className="font-mono text-xs">{note.currentBlock}</span>
        </Row>
        <Row label="Reclaim height">
          <span className="font-mono text-xs">{note.reclaimHeight ?? "—"}</span>
        </Row>
        {note.timelockHeight != null && (
          <Row label="Time-lock height">
            <span className="font-mono text-xs">{note.timelockHeight}</span>
          </Row>
        )}
      </dl>

      {!note.isP2IDE && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>Not reclaimable</AlertTitle>
          <AlertDescription>
            This is a P2ID note with no reclaim height — only its target can
            consume it. There’s no creator reclaim path.
          </AlertDescription>
        </Alert>
      )}
      {note.isP2IDE && !senderIsYou && (
        <Alert>
          <Info />
          <AlertTitle>Not your note</AlertTitle>
          <AlertDescription>
            The connected account isn’t this note’s creator. Only the creator
            can reclaim it — connect that wallet.
          </AlertDescription>
        </Alert>
      )}
      {note.isP2IDE && timelocked && (
        <Alert>
          <Info />
          <AlertTitle>Time-locked</AlertTitle>
          <AlertDescription>
            Not consumable until block {note.timelockHeight}.
          </AlertDescription>
        </Alert>
      )}
      {note.isP2IDE && !heightPassed && !timelocked && (
        <Alert>
          <Info />
          <AlertTitle>Not yet reclaimable</AlertTitle>
          <AlertDescription>
            Reclaimable at block {note.reclaimHeight}
            {blocksToGo != null ? ` — ~${blocksToGo} blocks to go.` : "."}
          </AlertDescription>
        </Alert>
      )}

      <Button onClick={onReclaim} disabled={!canReclaim || reclaiming}>
        {reclaiming ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Undo2 data-icon="inline-start" />
        )}
        {reclaiming ? "Reclaiming…" : "Reclaim note"}
      </Button>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-1.5">{children}</dd>
    </div>
  );
}
