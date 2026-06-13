import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount, useChainId } from "wagmi";
import type { CompactBalanceResult } from "@epoch-protocol/epoch-intents-sdk";
import { useEpochSdk } from "./useEpochSdk";
import { getTokensForChain } from "../config/web3";

export type DepositRow = CompactBalanceResult & {
  /** Unix seconds when the forced withdrawal unlocks; null when not initiated */
  availableAt: number | null;
};

export const depositedBalancesKey = (chainId: number, address?: string) => [
  "depositedBalances",
  chainId,
  address,
];

/**
 * Compact deposited balances for the connected wallet, enriched with the
 * forced-withdrawal unlock timestamp for rows where a withdrawal is pending.
 */
export function useDepositedBalances() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const sdk = useEpochSdk();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: depositedBalancesKey(chainId, address),
    enabled: isConnected && !!address && !!sdk,
    // Globals pin staleTime/gcTime to Infinity; deposits must stay fresh.
    staleTime: 10_000,
    gcTime: 5 * 60_000,
    refetchInterval: (q) => {
      const rows = q.state.data as DepositRow[] | undefined;
      if (!rows?.some((r) => r.withdrawStatus === "Pending")) return 15_000;
      const now = Date.now() / 1000;
      const nearReady = rows.some(
        (r) =>
          r.withdrawStatus === "Pending" &&
          r.availableAt !== null &&
          r.availableAt - now < 90,
      );
      return nearReady ? 5_000 : 15_000;
    },
    queryFn: async (): Promise<DepositRow[]> => {
      if (!sdk || !address) return [];
      const tokens = getTokensForChain(chainId).map((t) => ({
        address: t.address as `0x${string}`,
        symbol: t.symbol,
        decimals: t.decimals,
      }));
      if (tokens.length === 0) return [];

      const balances = await sdk.getDepositedBalances(address, tokens);

      return Promise.all(
        balances.map(async (row): Promise<DepositRow> => {
          if (row.withdrawStatus === "Disabled") {
            return { ...row, availableAt: null };
          }
          try {
            const { enabledAt } = await sdk.getForcedWithdrawalStatus(
              address,
              row.depositId,
            );
            return { ...row, availableAt: Number(enabledAt) };
          } catch {
            return { ...row, availableAt: null };
          }
        }),
      );
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: depositedBalancesKey(chainId, address),
    });

  return { ...query, invalidate };
}
