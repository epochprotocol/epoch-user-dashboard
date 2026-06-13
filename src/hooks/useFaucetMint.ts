import { useState } from "react";
import { parseUnits } from "viem";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWriteContract,
} from "wagmi";
import { ERC20_ABI } from "../constants/contracts";
import { useNotification } from "./useNotification";
import type { TokenInfo } from "../config/web3";

/**
 * Mint test tokens via the open mint() on epoch test ERC20s.
 * Per-token pending state so faucet cards stay independent.
 */
export function useFaucetMint(token: TokenInfo) {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { showNotification } = useNotification();
  const [isMinting, setIsMinting] = useState(false);

  const mint = async (amount: string, onConfirmed?: () => void) => {
    if (!address || !amount || isNaN(Number(amount))) return;

    setIsMinting(true);
    const tempTxId = `pending-mint-${token.address}-${Date.now()}`;

    showNotification({
      type: "info",
      title: "Minting Tokens",
      message: `Minting ${amount} ${token.symbol}…`,
      stage: "initiated",
      txHash: tempTxId,
      chainId,
      autoHide: false,
    });

    try {
      const value = parseUnits(amount, token.decimals);
      const hash = await writeContractAsync({
        address: token.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "mint",
        args: [address, value],
      });

      showNotification({
        type: "success",
        title: "Mint Submitted",
        message: "Waiting for confirmation…",
        stage: "submitted",
        txHash: hash,
        chainId,
        autoHide: true,
      });

      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        if (receipt.status === "success") {
          showNotification({
            type: "success",
            title: "Tokens Minted",
            message: `Successfully minted ${amount} ${token.symbol}`,
            stage: "confirmed",
            txHash: hash,
            chainId,
            autoHide: true,
          });
          onConfirmed?.();
        } else {
          showNotification({
            type: "error",
            title: "Mint Failed",
            message: "Transaction reverted",
            txHash: hash,
            chainId,
          });
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to mint tokens";
      if (!message.toLowerCase().includes("user rejected")) {
        showNotification({
          type: "error",
          title: "Mint Failed",
          message,
          chainId,
        });
      }
    } finally {
      setIsMinting(false);
    }
  };

  return { mint, isMinting };
}
