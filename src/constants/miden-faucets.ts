import faucetIds from "./miden-faucet-ids.testnet-0.17.json";

/** Valueless 0.17 Miden Testnet faucets used by Epoch's test flows. */
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
    faucetId: faucetIds.USDC,
  },
  {
    symbol: "DAI",
    decimals: MIDEN_FAUCET_DECIMALS,
    maxSupply: 1_000_000_000,
    faucetId: faucetIds.DAI,
  },
  {
    symbol: "USDT",
    decimals: MIDEN_FAUCET_DECIMALS,
    maxSupply: 1_000_000_000,
    faucetId: faucetIds.USDT,
  },
  {
    symbol: "WETH",
    decimals: MIDEN_FAUCET_DECIMALS,
    maxSupply: 1_000_000_000,
    faucetId: faucetIds.WETH,
  },
  {
    symbol: "WBTC",
    decimals: MIDEN_FAUCET_DECIMALS,
    maxSupply: 1_000_000_000,
    faucetId: faucetIds.WBTC,
  },
];

/** Faucet signing files are committed for these valueless Testnet assets. */
export const MIDEN_FAUCETS_CONFIGURED = true;

export const MIDEN_TESTNET_EXPLORER_URL = "https://testnet.midenscan.com";

export function isValidMidenId(id: string): boolean {
  const s = id.trim();
  return /^0x[0-9a-fA-F]+$/.test(s) || /^[a-z0-9]+1[a-z0-9_]+$/i.test(s);
}
