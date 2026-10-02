import {
  arbitrum,
  base,
  baseSepolia,
  optimism,
  optimismSepolia,
  polygon,
  sepolia,
} from "viem/chains";

const ANKR_API_KEY =
  (import.meta.env.VITE_ANKR_API_KEY as string | undefined)?.trim() ?? "";

function ankrRpcUrl(network: string): string {
  return ANKR_API_KEY
    ? `https://rpc.ankr.com/${network}/${ANKR_API_KEY}`
    : `https://rpc.ankr.com/${network}`;
}

/** RPC URLs for graph chains (including chains not in wagmi config). */
export const RPC_ENDPOINTS: Record<number, string> = {
  1: ankrRpcUrl("eth"),
  10: ankrRpcUrl("optimism"),
  137: ankrRpcUrl("polygon"),
  8453: ankrRpcUrl("base"),
  42161: ankrRpcUrl("arbitrum"),
  4663: "https://rpc.mainnet.chain.robinhood.com",
  11155420: ankrRpcUrl("optimism_sepolia"),
  84532: ankrRpcUrl("base_sepolia"),
  11155111: ankrRpcUrl("eth_sepolia"),
  46630: "https://rpc.testnet.chain.robinhood.com",
  10143: ankrRpcUrl("monad_testnet"),
  129399: "https://rpc.tatara.katanarpc.com/",
  11155931: "https://testnet.riselabs.xyz",
};

const VIEM_CHAIN_RPCS = [
  sepolia,
  baseSepolia,
  optimismSepolia,
  polygon,
  arbitrum,
  base,
  optimism,
] as const;

export function getRpcUrlForChain(chainId: number): string | undefined {
  if (RPC_ENDPOINTS[chainId]) {
    return RPC_ENDPOINTS[chainId];
  }

  const chain = VIEM_CHAIN_RPCS.find((entry) => entry.id === chainId);
  return chain?.rpcUrls.default.http[0];
}
