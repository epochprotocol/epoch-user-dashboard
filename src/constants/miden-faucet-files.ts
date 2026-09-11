import faucetFilesJson from "./miden-faucet-files.json";

/** Canonical signing files for valueless Testnet faucets. Never use on mainnet. */
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
