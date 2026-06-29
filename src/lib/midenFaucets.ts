import type { MidenClient } from "@miden-sdk/miden-sdk";
import { parseUnits } from "viem";
import { FUNGIBLE_FAUCET, MIDEN_FAUCETS } from "@/constants/miden-faucets";

/**
 * Derives the faucet accounts from the seeded client and returns
 * `{ symbol -> faucetId }`.
 *
 * Because the client RNG is seeded, creating the faucets in MIDEN_FAUCETS order
 * is deterministic: the same seed + order reproduces the same ids + keys in any
 * browser, and inserts the signing keys into this client's keystore so it can
 * mint. We create the WHOLE list (not just the requested token) so ordering — and
 * therefore the derived ids — stays consistent.
 *
 * The resulting ids are cached in localStorage (per browser) so reloads don't
 * re-create (which would throw "already tracked"); the keys themselves live in
 * the client's IndexedDB keystore. Memoised per tab.
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

/** Force a fresh derivation (e.g. the dev "Create faucets" button). */
export function resetFaucetCache(): void {
  ensurePromise = null;
  try {
    localStorage.removeItem(LS_KEY);
  } catch {
    /* ignore */
  }
}

async function deriveAll(
  client: MidenClient,
): Promise<Record<string, string>> {
  const symbols = MIDEN_FAUCETS.map((f) => f.symbol);

  const cached = readCache();
  if (cached && symbols.every((s) => cached[s])) {
    await client.sync(); // refresh on-chain state for current nonces
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
