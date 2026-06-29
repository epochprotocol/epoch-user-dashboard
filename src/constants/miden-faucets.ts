/**
 * Miden testnet faucet registry — seed-driven, no stored account files.
 *
 * HOW THIS WORKS (read docs/MIDEN_FAUCETS.md for the full story):
 *
 * The in-browser Miden client is created with a fixed **seed** (VITE_MIDEN_FAUCET_SEED).
 * Miden seeds the client RNG with it ("for account initialization"), so creating
 * the faucets below — in this exact order — is deterministic: same seed + same
 * order ⇒ the same faucet ids and the same signing keys, in any browser. That is
 * why we no longer commit per-faucet `AccountFile` blobs; the seed regenerates
 * the keys on demand.
 *
 * ORDER MATTERS: the client RNG advances on every account creation, so faucet N
 * only reproduces if faucets 1..N-1 were created first. Never reorder or delete
 * entries in the middle of this list — only append.
 *
 * SECURITY: the seed is the faucet master key. It ships in the frontend bundle
 * (a VITE_ var is inlined at build time — no safer than committing it). Acceptable
 * ONLY for valueless testnet faucets. Never use this seed on mainnet or for any
 * account that holds value.
 */

/** Decimals every Miden faucet in this stack uses. Do not change — dex-solver,
 *  epoch-sio and the epoch graph all assume 6 for Miden. */
export const MIDEN_FAUCET_DECIMALS = 6;

/** Master seed for the Miden client. All faucet ids + keys derive from this. */
export const MIDEN_FAUCET_SEED = import.meta.env.VITE_MIDEN_FAUCET_SEED as
  | string
  | undefined;

export interface MidenFaucetConfig {
  /** Display ticker, e.g. "USDC". */
  symbol: string;
  /** Token decimals on Miden. Always {@link MIDEN_FAUCET_DECIMALS}. */
  decimals: number;
  /** Faucet max supply in whole tokens (converted to base units at creation). */
  maxSupply: number;
  /** Faucet account id (hex/bech32). Optional — derived from the seed at runtime;
   *  fill it in only for display/explorer links after the first deploy. */
  faucetId?: string;
}

/**
 * The faucets surfaced in the dashboard, created in THIS ORDER from the seed.
 * Append-only (see ORDER MATTERS above).
 */
export const MIDEN_FAUCETS: MidenFaucetConfig[] = [
  { symbol: "USDC", decimals: MIDEN_FAUCET_DECIMALS, maxSupply: 1_000_000_000, faucetId: "0x8ddb61e056105cf119634d919be743" },
  { symbol: "DAI", decimals: MIDEN_FAUCET_DECIMALS, maxSupply: 1_000_000_000, faucetId: "0xd162796b525d6c517a0d2a332413d4" },
  { symbol: "USDT", decimals: MIDEN_FAUCET_DECIMALS, maxSupply: 1_000_000_000, faucetId: "0xd2f049a23e9068715a2def9842673f" },
  { symbol: "WETH", decimals: MIDEN_FAUCET_DECIMALS, maxSupply: 1_000_000_000, faucetId: "0xd4510f4a85b542b144b84b04670ae6" },
  { symbol: "WBTC", decimals: MIDEN_FAUCET_DECIMALS, maxSupply: 1_000_000_000, faucetId: "0xb7856af9c04fd3b124308caf69c9f4" },
];

/** AccountType.FungibleFaucet — the named enum is ambiguous across SDK re-exports,
 *  so we use its numeric value (FaucetCreateOptions.type is 0 | 1 | 2 | 3). */
export const FUNGIBLE_FAUCET = 0 as const;

/** The dashboard can mint once a seed is configured (faucets derive from it). */
export const MIDEN_FAUCETS_CONFIGURED = Boolean(MIDEN_FAUCET_SEED);

export const MIDEN_TESTNET_EXPLORER_URL = "https://testnet.midenscan.com";

/**
 * Accept a Miden account id in either form the SDK emits:
 *  - hex:    `0x2458e544…`
 *  - bech32: `mtst1azfj5scc…` (testnet-prefixed)
 */
export function isValidMidenId(id: string): boolean {
  const s = id.trim();
  return /^0x[0-9a-fA-F]+$/.test(s) || /^[a-z0-9]+1[a-z0-9_]+$/i.test(s);
}
