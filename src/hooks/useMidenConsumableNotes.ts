import { useCallback, useEffect, useState } from "react";
import { useMidenFiWallet } from "@miden-sdk/miden-wallet-adapter-react";
import { lookupFaucetMeta } from "@/lib/midenReclaim";

export interface ConsumableNote {
  noteId: string;
  senderAccountId: string | null;
  faucetId: string | null;
  amount: bigint;
  symbol: string | null;
  decimals: number;
  /** The connected account created this note → consuming it is a reclaim. */
  isReclaim: boolean;
}

/**
 * Lists notes the connected wallet can consume right now, via the wallet's
 * `requestConsumableNotes()`. A note whose sender is the connected account is a
 * reclaim (the user's own P2IDE note coming back after `reclaim_height`);
 * anything else is a normal incoming note the user can claim. Notes that are
 * time-locked or not yet past `reclaim_height` are not consumable, so they do
 * not appear here — use the paste-by-id path to inspect those.
 */
export function useMidenConsumableNotes(
  connected: boolean,
  accountIdHex: string | null,
) {
  const { requestConsumableNotes } = useMidenFiWallet();
  const [notes, setNotes] = useState<ConsumableNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!connected || !requestConsumableNotes) {
      setNotes([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const raw = await requestConsumableNotes();
      const me = accountIdHex?.trim().toLowerCase() ?? null;
      const mapped = (raw ?? []).map((n): ConsumableNote => {
        const first = n.assets?.[0];
        const faucetId = first?.faucetId ?? null;
        const { symbol, decimals } = lookupFaucetMeta(faucetId);
        const sender = n.senderAccountId ?? null;
        return {
          noteId: n.noteId,
          senderAccountId: sender,
          faucetId,
          amount: first?.amount ? safeBigInt(first.amount) : 0n,
          symbol,
          decimals,
          isReclaim: !!me && !!sender && sender.trim().toLowerCase() === me,
        };
      });
      setNotes(mapped);
    } catch (err) {
      setNotes([]);
      setError(
        err instanceof Error ? err.message : "Failed to load consumable notes",
      );
    } finally {
      setLoading(false);
    }
  }, [connected, requestConsumableNotes, accountIdHex]);

  useEffect(() => {
    if (!connected) {
      setNotes([]);
      setError(null);
      return;
    }
    void refresh();
  }, [connected, refresh]);

  return {
    notes,
    loading,
    error,
    refresh,
    supported: !!requestConsumableNotes,
  };
}

function safeBigInt(v: string): bigint {
  try {
    return BigInt(v);
  } catch {
    return 0n;
  }
}
