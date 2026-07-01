import type { AccountId, MidenClient } from "@miden-sdk/miden-sdk";
import { parseUnits } from "viem";
import { FUNGIBLE_FAUCET, MIDEN_FAUCETS } from "@/constants/miden-faucets";
import {
  MIDEN_FAUCET_FILES,
  hasAllFaucetFiles,
  base64ToBytes,
  bytesToBase64,
} from "@/constants/miden-faucet-files";

/**
 * Resolves the canonical faucet accounts into the client's keystore and returns
 * `{ symbol -> faucetId }`. The returned id is ALWAYS the one present in the local
 * store, so callers can mint from it directly.
 *
 * PREFERRED PATH — committed AccountFiles (see miden-faucet-files.ts):
 *   Each faucet is imported from a committed base64 AccountFile. A faucet id =
 *   hash(init_seed + code + storage) and the faucet-create API takes no init_seed,
 *   so seed-derivation cannot reproduce a faucet id across stores. Importing a
 *   saved AccountFile does — same id + signing key in every browser, forever.
 *
 * FALLBACK PATH — seed-derivation (only until files are committed):
 *   `client.accounts.create()` mints a fresh, non-reproducible faucet per clean
 *   store — the exact bug that produces look-alike tokens. Kept only so the app
 *   works before the one-time export; warns loudly.
 *
 * Memoised per tab; ids also cached in localStorage for the fallback path.
 */
const LS_KEY = "epoch-miden-faucet-ids";

let ensurePromise: Promise<Record<string, string>> | null = null;

export function ensureFaucets(
  client: MidenClient,
): Promise<Record<string, string>> {
  if (!ensurePromise) {
    ensurePromise = deriveAll(client).catch((e) => {
      ensurePromise = null; // allow retry on failure
      throw e;
    });
  }
  return ensurePromise;
}

/** Force a fresh derivation (e.g. the dev "Force re-derive" button). */
export function resetFaucetCache(): void {
  ensurePromise = null;
  try {
    localStorage.removeItem(LS_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Refresh a faucet account's on-chain commitment before minting. The keystore
 * signing key survives import; only vault/nonce state is updated from the network.
 */
export async function refreshFaucetForMint(
  client: MidenClient,
  faucetId: string,
): Promise<void> {
  await client.sync();
  try {
    await client.accounts.import(faucetId);
  } catch {
    // Not yet on-chain — genesis / AccountFile state is still correct.
  }
}

async function deriveAll(client: MidenClient): Promise<Record<string, string>> {
  const symbols = MIDEN_FAUCETS.map((f) => f.symbol);

  if (hasAllFaucetFiles(symbols)) {
    return importCanonicalFaucets(client);
  }

  console.warn(
    "[miden faucets] No committed AccountFiles — using seed-derivation. Faucet " +
      "ids are NOT reproducible across stores (faucet-create takes no init_seed), " +
      "so this can spawn duplicate look-alike tokens. Fix: dev Faucets page → " +
      "'Export faucet files' → commit the printed block into miden-faucet-files.ts.",
  );
  return createFromSeed(client);
}

/**
 * Import each canonical faucet from its committed AccountFile. Idempotent: the id
 * is read from the file itself (`AccountFile.accountId()`) and we skip the import
 * if that account is already tracked. Returns the real in-store id per symbol.
 */
async function importCanonicalFaucets(
  client: MidenClient,
): Promise<Record<string, string>> {
  const { AccountFile } = await import("@miden-sdk/miden-sdk");
  const ids: Record<string, string> = {};

  for (const faucet of MIDEN_FAUCETS) {
    const b64 = MIDEN_FAUCET_FILES[faucet.symbol];
    if (!b64)
      throw new Error(`Missing committed AccountFile for ${faucet.symbol}`);

    const file = AccountFile.deserialize(base64ToBytes(b64));
    const id = file.accountId();

    const existing = await client.accounts.get(id).catch(() => null);
    if (!existing) {
      await client.accounts.import({ file });
    }
    ids[faucet.symbol] = id.toString();
  }

  await client.sync(); // refresh on-chain state (nonces) for the imported faucets
  return ids;
}

/**
 * Export the canonical faucets to committable base64 AccountFiles. Calls
 * {@link ensureFaucets} first (imports, or on a fresh deploy creates them), then
 * exports each. Returns `{ ids, files }` for pasting into the constants files.
 */
export async function exportFaucetFiles(
  client: MidenClient,
): Promise<{ ids: Record<string, string>; files: Record<string, string> }> {
  const ids = await ensureFaucets(client);
  const { AccountId } = await import("@miden-sdk/miden-sdk");
  const files: Record<string, string> = {};

  for (const faucet of MIDEN_FAUCETS) {
    const ref = toAccountIdRef(AccountId, ids[faucet.symbol]);
    if (!ref)
      throw new Error(`No id resolved for ${faucet.symbol}; cannot export`);
    const file = await client.accounts.export(ref);
    files[faucet.symbol] = bytesToBase64(file.serialize());
  }

  return { ids, files };
}

// ── seed-derivation fallback (legacy, non-reproducible) ─────────────────────
async function createFromSeed(
  client: MidenClient,
): Promise<Record<string, string>> {
  const symbols = MIDEN_FAUCETS.map((f) => f.symbol);

  const cached = readCache();
  if (cached && symbols.every((s) => cached[s])) {
    await client.sync();
    return cached;
  }

  const { StorageMode } = await import("@miden-sdk/miden-sdk");
  const ids: Record<string, string> = {};
  for (const faucet of MIDEN_FAUCETS) {
    try {
      const account = await client.accounts.create({
        type: FUNGIBLE_FAUCET,
        symbol: faucet.symbol,
        decimals: faucet.decimals,
        maxSupply: parseUnits(String(faucet.maxSupply), faucet.decimals),
        storage: StorageMode.Public,
      });
      ids[faucet.symbol] = account.id().toString();
    } catch (e) {
      if (isAlreadyExists(e)) {
        throw new Error(
          `Faucet "${faucet.symbol}" already exists in this browser store but its id wasn't cached. ` +
            `Clear this site's IndexedDB + localStorage to re-derive from the seed.`,
        );
      }
      throw e;
    }
  }

  writeCache(ids);
  await client.sync();
  return ids;
}

// ── helpers ─────────────────────────────────────────────────────────────────
function toAccountIdRef(
  AccountIdCtor: typeof import("@miden-sdk/miden-sdk").AccountId,
  id: string | undefined,
): AccountId | null {
  if (!id) return null;
  const s = id.trim();
  try {
    return s.startsWith("0x")
      ? AccountIdCtor.fromHex(s)
      : AccountIdCtor.fromBech32(s);
  } catch {
    return null;
  }
}

function isAlreadyExists(e: unknown): boolean {
  const msg = String(e).toLowerCase();
  return (
    msg.includes("already") &&
    (msg.includes("tracked") || msg.includes("exist"))
  );
}

function readCache(): Record<string, string> | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : null;
  } catch {
    return null;
  }
}

function writeCache(ids: Record<string, string>): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}
