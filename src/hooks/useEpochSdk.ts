import { useMemo } from "react";
import { useWalletClient } from "wagmi";
import { EpochIntentSDK } from "@epoch-protocol/epoch-intents-sdk";

/**
 * Shared, memoized SDK instance keyed on the connected wallet client.
 * Returns null until the wallet client is available.
 */
export function useEpochSdk(): EpochIntentSDK | null {
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!walletClient) return null;
    return new EpochIntentSDK({
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      walletClient: walletClient as any,
    });
  }, [walletClient]);
}
