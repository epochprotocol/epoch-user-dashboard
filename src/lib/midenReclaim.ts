import {
  MIDEN_FAUCET_DECIMALS,
  MIDEN_FAUCETS,
} from "@/constants/miden-faucets";

/**
 * Read-only Miden note lookups for the reclaim flow.
 *
 * Reclaim = the note's CREATOR consuming an unconsumed P2IDE note after its
 * `reclaim_height`. In the Epoch cross-chain flow a user mints a P2IDE
 * collateral note to the allocator; if the intent never settles, the note sits
 * unconsumed and the user (creator) can reclaim the assets once the chain passes
 * `reclaim_height` (see docs.miden.xyz — P2IDE note type).
 *
 * This module only READS chain state via `RpcClient` (no store, no keys). The
 * actual reclaim is signed by the user's wallet — see `useMidenReclaim`.
 *
 * P2IDE recipient storage layout (from smallocator/MIDEN_NOTE_STRUCTURE.md):
 *   [0] target account id (low felt)
 *   [1] target account id (high felt)
 *   [2] reclaim block height   ← creator may consume at/after this height
 *   [3] time-lock block height (optional; nobody may consume before it)
 */

export interface ReclaimNoteInfo {
  noteId: string;
  /** Note creator — must equal the connected account to reclaim. */
  senderAccountId: string | null;
  faucetId: string | null;
  /** Asset amount in base units. */
  amount: bigint;
  symbol: string | null;
  decimals: number;
  /** Block after which the creator can reclaim; null when not a P2IDE note. */
  reclaimHeight: number | null;
  /** Time-lock height, if any (note not consumable before it). */
  timelockHeight: number | null;
  /** Latest known chain height at lookup time. */
  currentBlock: number;
  isP2IDE: boolean;
}

export type ReclaimLookup =
  | { found: true; note: ReclaimNoteInfo; currentBlock: number }
  | {
      found: false;
      currentBlock: number | null;
      reason: string;
    };

/** Map a faucet id (hex) to a known Epoch faucet's ticker + decimals. */
export function lookupFaucetMeta(faucetIdHex: string | null): {
  symbol: string | null;
  decimals: number;
} {
  if (!faucetIdHex) return { symbol: null, decimals: MIDEN_FAUCET_DECIMALS };
  const target = faucetIdHex.trim().toLowerCase();
  const match = MIDEN_FAUCETS.find(
    (f) => f.faucetId?.trim().toLowerCase() === target,
  );
  return {
    symbol: match?.symbol ?? null,
    decimals: match?.decimals ?? MIDEN_FAUCET_DECIMALS,
  };
}

export function normalizeNoteId(raw: string): string {
  const t = raw.replace(/\s+/g, "").trim().toLowerCase();
  if (t.startsWith("0x")) return t;
  if (/^[0-9a-f]+$/i.test(t)) return `0x${t}`;
  return t;
}

const MIDEN_RPC_URL = (
  import.meta.env.VITE_MIDEN_RPC_URL as string | undefined
)?.trim();

/**
 * Fetch a committed public note by id and derive its reclaim eligibility.
 * Returns `{ found: false }` when the note can't be resolved (private,
 * already consumed/pruned, or a bad id).
 */
export async function fetchReclaimNote(rawId: string): Promise<ReclaimLookup> {
  const { RpcClient, Endpoint, NoteId } = await import("@miden-sdk/miden-sdk");
  const endpoint = MIDEN_RPC_URL
    ? new Endpoint(MIDEN_RPC_URL)
    : Endpoint.testnet();
  const rpc = new RpcClient(endpoint);
  let currentBlock: number | null = null;
  try {
    const idNorm = normalizeNoteId(rawId);
    let nid: import("@miden-sdk/miden-sdk").NoteId;
    try {
      nid = NoteId.fromHex(idNorm);
    } catch {
      return { found: false, currentBlock: null, reason: "Invalid note id." };
    }

    const [header, fetched] = await Promise.all([
      rpc.getBlockHeaderByNumber().catch(() => null),
      rpc.getNotesById([nid]).catch(() => []),
    ]);
    currentBlock = header?.blockNum() ?? null;

    if (fetched.length === 0 || !fetched[0].note) {
      return {
        found: false,
        currentBlock,
        reason:
          "Note not found on-chain. It may be private, already reclaimed, or the id is wrong.",
      };
    }

    const note = fetched[0].note;
    const senderAccountId = safe(() => note.metadata().sender().toString());

    const fungible = safe(() => note.assets().fungibleAssets()) ?? [];
    const first = fungible[0];
    const faucetId = first ? safe(() => first.faucetId().toString()) : null;
    const amount = first ? (safe(() => first.amount()) ?? 0n) : 0n;

    const items =
      safe(() =>
        note
          .recipient()
          .storage()
          .items()
          .map((felt) => felt.toString()),
      ) ?? [];

    // P2ID = 2 storage items (target only); P2IDE = 4 (target, reclaim, timelock).
    const isP2IDE = items.length >= 3;
    const reclaimHeight = isP2IDE ? feltToNumber(items[2]) : null;
    const timelockHeight = items.length >= 4 ? feltToNumber(items[3]) : null;

    const { symbol, decimals } = lookupFaucetMeta(faucetId);

    return {
      found: true,
      currentBlock: currentBlock ?? 0,
      note: {
        noteId: idNorm,
        senderAccountId,
        faucetId,
        amount,
        symbol,
        decimals,
        reclaimHeight,
        timelockHeight,
        currentBlock: currentBlock ?? 0,
        isP2IDE,
      },
    };
  } catch (err) {
    return {
      found: false,
      currentBlock,
      reason: err instanceof Error ? err.message : "Failed to look up note.",
    };
  } finally {
    freeSafe(rpc);
    freeSafe(endpoint);
  }
}

/** Latest chain height, or null if the RPC is unreachable. */
export async function fetchCurrentBlock(): Promise<number | null> {
  const { RpcClient, Endpoint } = await import("@miden-sdk/miden-sdk");
  const endpoint = MIDEN_RPC_URL
    ? new Endpoint(MIDEN_RPC_URL)
    : Endpoint.testnet();
  const rpc = new RpcClient(endpoint);
  try {
    const header = await rpc.getBlockHeaderByNumber();
    return header.blockNum();
  } catch {
    return null;
  } finally {
    freeSafe(rpc);
    freeSafe(endpoint);
  }
}

function feltToNumber(felt: string | undefined): number | null {
  if (felt == null) return null;
  try {
    return Number(BigInt(felt));
  } catch {
    return null;
  }
}

function safe<T>(fn: () => T): T | null {
  try {
    return fn();
  } catch {
    return null;
  }
}

function freeSafe(x: { free?: () => void }): void {
  try {
    x.free?.();
  } catch {
    /* ignore */
  }
}
