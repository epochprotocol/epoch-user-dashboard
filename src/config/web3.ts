import { mainnetGraph, testnetGraph } from "@epoch-protocol/epoch-intents-sdk";
import { getAddress, isAddress } from "viem";

// Graph shape from epoch-commons-sdk: tokens keyed by symbol, chains keyed by chain name
type GraphChain = { chainId: number; explorer: string };
type GraphTokens = Record<
  string,
  { contractAddress: Record<string, string>; decimals: number }
>;
type EpochGraph = {
  chains: Record<string, GraphChain>;
  tokens: GraphTokens;
};

function graphHasChain(graph: EpochGraph, chainId: number): boolean {
  return Object.values(graph.chains).some(
    (chain) => chain.chainId === chainId,
  );
}

function getGraphForChain(chainId: number): EpochGraph {
  return graphHasChain(mainnetGraph as EpochGraph, chainId)
    ? (mainnetGraph as EpochGraph)
    : (testnetGraph as EpochGraph);
}

function getChainNameByChainId(
  graph: EpochGraph,
  chainId: number,
): string | null {
  for (const [name, chain] of Object.entries(graph.chains)) {
    if (chain.chainId === chainId) return name;
  }
  return null;
}

export interface TokenInfo {
  symbol: string;
  address: string;
  decimals: number;
}

function normalizeGraphAddress(address: string): string {
  if (isAddress(address)) {
    return getAddress(address);
  }
  return address;
}

/**
 * Get list of tokens for a chain from the appropriate graph (mainnet or testnet).
 * Returns tokens that have a contract address for the given chain.
 */
export function getTokensForChain(chainId: number): TokenInfo[] {
  const graph = getGraphForChain(chainId);
  const chainName = getChainNameByChainId(graph, chainId);
  if (!chainName) return [];

  const result: TokenInfo[] = [];
  for (const [symbol, token] of Object.entries(graph.tokens)) {
    const rawAddress =
      token.contractAddress[chainName] ?? token.contractAddress["*"];
    if (rawAddress) {
      result.push({
        symbol,
        address: normalizeGraphAddress(rawAddress),
        decimals: token.decimals,
      });
    }
  }
  return result;
}

export interface ChainInfo {
  name: string;
  chainId: number;
  explorer: string;
}

/**
 * Get list of chains from the appropriate graph (mainnet or testnet).
 * Optionally exclude the current chain so it can be used for destination dropdown.
 */
export function getChainsFromGraph(
  chainId: number,
  options?: { excludeCurrentChain?: boolean },
): ChainInfo[] {
  const graph = getGraphForChain(chainId);
  const result: ChainInfo[] = [];
  for (const [name, chain] of Object.entries(graph.chains)) {
    if (options?.excludeCurrentChain && chain.chainId === chainId) continue;
    result.push({
      name,
      chainId: chain.chainId,
      explorer: chain.explorer,
    });
  }
  return result;
}

export { mainnetGraph, testnetGraph };

/**
 * Check if a chain is absent from the mainnet graph.
 */
export function isTestnetChain(chainId: number): boolean {
  return !graphHasChain(mainnetGraph as EpochGraph, chainId);
}

export interface MidenFaucetToken {
  symbol: string;
  faucetId: string;
  decimals: number;
}

export const MIDEN_TESTNET_FAUCET_URL = "https://faucet.testnet.miden.io";
export const MIDEN_TESTNET_EXPLORER_URL =
  (testnetGraph as EpochGraph).chains["Miden"]?.explorer ??
  "https://testnet.midenscan.com/";

/**
 * Tokens that have a Miden faucet ID in the testnet graph.
 * Miden IDs are not EVM addresses, so they are returned as-is.
 */
export function getMidenFaucetTokens(): MidenFaucetToken[] {
  const graph = testnetGraph as EpochGraph;
  const result: MidenFaucetToken[] = [];
  for (const [symbol, token] of Object.entries(graph.tokens)) {
    const faucetId = token.contractAddress["Miden"];
    if (faucetId) {
      result.push({ symbol, faucetId, decimals: token.decimals });
    }
  }
  return result;
}
