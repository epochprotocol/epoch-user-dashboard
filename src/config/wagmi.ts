import { http } from "wagmi";
import {
  sepolia,
  baseSepolia,
  optimismSepolia,
  polygon,
  arbitrum,
  base,
  optimism,
} from "viem/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { robinhood, robinhoodTestnet } from "./robinhood";
import { getRpcUrlForChain } from "./rpc";

// Configure supported chains
const projectId = "YOUR_PROJECT_ID"; // Get from WalletConnect Cloud

export const chains = [
  sepolia,
  baseSepolia,
  optimismSepolia,
  polygon,
  arbitrum,
  base,
  optimism,
  robinhood,
  robinhoodTestnet,
] as const;

// Create wagmi config using RainbowKit's getDefaultConfig
// Sepolia is set as the first chain, making it the default chain
export const config = getDefaultConfig({
  appName: "Smallocator",
  projectId,
  chains,
  transports: {
    // Use a single transport configuration for all chains
    ...Object.fromEntries(
      chains.map((chain) => [
        chain.id,
        http(getRpcUrlForChain(chain.id) ?? chain.rpcUrls.default.http[0]),
      ]),
    ),
  },
});

// Export chain IDs for type safety
export const CHAIN_IDS = {
  SEPOLIA: sepolia.id,
  BASE_SEPOLIA: baseSepolia.id,
  OPTIMISM_SEPOLIA: optimismSepolia.id,
  POLYGON: polygon.id,
  ARBITRUM: arbitrum.id,
  BASE: base.id,
  OPTIMISM: optimism.id,
  ROBINHOOD: robinhood.id,
  ROBINHOOD_TESTNET: robinhoodTestnet.id,
} as const;
