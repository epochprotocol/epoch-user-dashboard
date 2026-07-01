import faucetFilesJson from "./miden-faucet-files.json";

/**
 * Canonical Miden faucet AccountFiles — the SINGLE SOURCE OF TRUTH for faucet
 * identity (account id + signing key). The data lives in the sibling JSON file
 * `miden-faucet-files.json` (base64 AccountFile keyed by faucet symbol); this
 * module just loads it and adds helpers.
 *
 * WHY THIS EXISTS (the bug it fixes):
 *   A faucet's account id = hash(init_seed + code_commitment + storage_commitment)
 *   (https://docs.miden.xyz/reference/protocol/account/id/). The id is only
 *   deterministic for a FIXED init_seed — and the high-level faucet-create API
 *   (`client.accounts.create({type: faucet})`) exposes no init_seed, so it makes
 *   a fresh one on every clean store. Result: each new browser/machine/redeploy
 *   spawns a NEW faucet with the same ticker but a different id, and users end up
 *   holding look-alike "USDC"/"DAI" tokens that are NOT fungible with each other.
 *
 *   The only way to have ONE canonical faucet usable everywhere is to persist the
 *   account (id + key) once and import it. That is what the JSON holds.
 *
 * HOW TO POPULATE (one-time, per network):
 *   1. Open the dev "Faucets" page (import.meta.env.DEV) on the browser whose
 *      store already mints the tokens you want to keep, then click
 *      "Export faucet files (commit these)".
 *   2. Overwrite `miden-faucet-files.json` with the printed JSON, AND paste the
 *      printed ids into `MIDEN_FAUCETS` (faucetId fields) in `miden-faucets.ts`
 *      and into the decimals map in
 *      `miden-integration-example/src/constants/miden-tokens.ts`.
 *   3. Commit. From then on every browser imports these exact faucets — stable
 *      ids, no duplicates, mint always targets the same faucet.
 *
 * SECURITY: these blobs contain the faucet signing keys. Intentional and fine for
 * VALUELESS TESTNET faucets only (same posture as the bundled seed). NEVER commit
 * mainnet or value-bearing account files.
 */
export const MIDEN_FAUCET_FILES: Record<string, string> =
  faucetFilesJson as Record<string, string>;

/** True once every configured faucet has a committed AccountFile. */
export function hasAllFaucetFiles(symbols: readonly string[]): boolean {
  return (
    symbols.length > 0 && symbols.every((s) => Boolean(MIDEN_FAUCET_FILES[s]))
  );
}

// ── base64 <-> bytes (browser, no Buffer) ──────────────────────────────────
export function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
