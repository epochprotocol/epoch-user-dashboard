import { useState } from "react";
import { parseUnits } from "viem";
import { getMidenClient } from "@/lib/midenClient";
import { ensureFaucets, refreshFaucetForMint } from "@/lib/midenFaucets";
import {
  MIDEN_FAUCETS_CONFIGURED,
  type MidenFaucetConfig,
} from "@/constants/miden-faucets";
import { useNotification } from "./useNotification";

/**
 * Mint a Miden faucet token straight from the browser, no backend.
 *
 * {@link ensureFaucets} loads the faucet accounts (id + key) into the client's
 * keystore — imported from committed AccountFiles when present (stable id in every
 * browser), else seed-derived as a fallback. Either way it returns the id that is
 * actually in the local store, which we mint from via `transactions.mint()` to
 * emit a public P2ID note to the recipient; their wallet picks it up on next sync.
 */
export function useMidenFaucetMint(faucet: MidenFaucetConfig) {
  const { showNotification } = useNotification();
  const [isMinting, setIsMinting] = useState(false);

  const mint = async (
    amount: string,
    recipientId: string,
    onConfirmed?: () => void,
  ) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    if (!recipientId) return;
    if (!MIDEN_FAUCETS_CONFIGURED) {
      showNotification({
        type: "error",
        title: "Faucet seed missing",
        message: "Set VITE_MIDEN_FAUCET_SEED, then create the faucets.",
        chainId: "miden",
      });
      return;
    }

    setIsMinting(true);
    const pendingId = `pending-miden-mint-${faucet.symbol}`;
    showNotification({
      type: "info",
      title: "Minting on Miden",
      message: `Minting ${amount} ${faucet.symbol} to ${recipientId.slice(0, 12)}…`,
      stage: "initiated",
      txHash: pendingId,
      chainId: "miden",
      autoHide: false,
    });

    try {
      const client = await getMidenClient();
      const { AccountId } = await import("@miden-sdk/miden-sdk");

      // Account ids arrive in hex (0x…) or bech32 (mtst1…); pick the right parser.
      const toAccountId = (id: string) =>
        id.trim().startsWith("0x")
          ? AccountId.fromHex(id.trim())
          : AccountId.fromBech32(id.trim());

      // Load faucets into the keystore; returns { symbol -> in-store faucetId }.
      const ids = await ensureFaucets(client);
      const faucetId = ids[faucet.symbol];
      if (!faucetId) throw new Error(`No faucet resolved for ${faucet.symbol}`);

      await refreshFaucetForMint(client, faucetId);

      const value = parseUnits(amount, faucet.decimals);
      const { txId } = await client.transactions.mint({
        account: toAccountId(faucetId),
        to: toAccountId(recipientId),
        amount: value,
        type: "public",
      });

      showNotification({
        type: "success",
        title: "Mint submitted",
        message: "Waiting for the network to settle the note…",
        stage: "submitted",
        txHash: txId.toString(),
        chainId: "miden",
        autoHide: true,
      });

      await client.sync();

      showNotification({
        type: "success",
        title: "Tokens minted",
        message: `Sent ${amount} ${faucet.symbol}. Sync your Miden wallet to consume the note.`,
        stage: "confirmed",
        txHash: txId.toString(),
        chainId: "miden",
        autoHide: true,
      });
      onConfirmed?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to mint on Miden";
      showNotification({
        type: "error",
        title: "Miden mint failed",
        message,
        chainId: "miden",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return { mint, isMinting };
}
