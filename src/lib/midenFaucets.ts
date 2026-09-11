import type { AccountId, MidenClient } from "@miden-sdk/miden-sdk";
import { MIDEN_FAUCETS } from "@/constants/miden-faucets";
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
 * Faucets are imported from committed AccountFiles so every browser uses the
 * same account id and signing key.
 */
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

/** Retry a failed import. */
export function resetFaucetCache(): void {
  ensurePromise = null;
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

  if (!hasAllFaucetFiles(symbols)) {
    throw new Error("Missing a committed Miden faucet AccountFile");
  }
  return importCanonicalFaucets(client);
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
