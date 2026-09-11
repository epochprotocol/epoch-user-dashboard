/** Valueless 0.16 Miden Testnet faucets used by Epoch's test flows. */
export const MIDEN_FAUCET_DECIMALS = 6;

export interface MidenFaucetConfig {
  symbol: string;
  decimals: number;
  maxSupply: number;
  faucetId: string;
}

export const MIDEN_FAUCETS: MidenFaucetConfig[] = [
  {
    symbol: "USDC",
    decimals: MIDEN_FAUCET_DECIMALS,
    maxSupply: 1_000_000_000,
    faucetId: "0x537c15a622074e91188aa894456c52",
  },
  {
    symbol: "DAI",
    decimals: MIDEN_FAUCET_DECIMALS,
    maxSupply: 1_000_000_000,
    faucetId: "0xd17976f0809a8191412f2a126625df",
  },
  {
    symbol: "USDT",
    decimals: MIDEN_FAUCET_DECIMALS,
    maxSupply: 1_000_000_000,
    faucetId: "0x6500ca8c2dd69e9147ab7eafad162c",
  },
  {
    symbol: "WETH",
    decimals: MIDEN_FAUCET_DECIMALS,
    maxSupply: 1_000_000_000,
    faucetId: "0x4a09f13153d9cd114c078bfb62a7ec",
  },
  {
    symbol: "WBTC",
    decimals: MIDEN_FAUCET_DECIMALS,
    maxSupply: 1_000_000_000,
    faucetId: "0x5fd2e6fd17712c51404d09c2b847f7",
  },
];

/** Faucet signing files are committed for these valueless Testnet assets. */
export const MIDEN_FAUCETS_CONFIGURED = true;

export const MIDEN_TESTNET_EXPLORER_URL = "https://testnet.midenscan.com";

export function isValidMidenId(id: string): boolean {
  const s = id.trim();
  return /^0x[0-9a-fA-F]+$/.test(s) || /^[a-z0-9]+1[a-z0-9_]+$/i.test(s);
}
