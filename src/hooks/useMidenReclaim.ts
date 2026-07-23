import { useState } from "react";
import { useMidenFiWallet } from "@miden-sdk/miden-wallet-adapter-react";
import type { NoteTypeString } from "@miden-sdk/miden-wallet-adapter-base";
import { formatUnits } from "viem";
import { useNotification } from "./useNotification";

const WAIT_TIMEOUT_MS = 120_000;

export interface ReclaimParams {
  noteId: string;
  /** Faucet id of the note's asset (hex). Required to build the consume tx. */
  faucetId: string;
  /** Asset amount in base units. */
  amount: bigint;
  noteType?: NoteTypeString;
  symbol?: string | null;
  decimals?: number;
  /** True when the connected account created the note (reclaim vs claim). */
  isReclaim?: boolean;
}

/**
 * Reclaim (or claim) a stuck Miden note by consuming it with the connected
 * wallet. For a P2IDE note the connected account created, consuming after the
 * note's `reclaim_height` returns the locked assets to the user — the reclaim
 * path from the Miden P2IDE docs. The wallet holds the account + signs; the
 * note script enforces the reclaim conditions on-chain.
 */
export function useMidenReclaim() {
  const { requestConsume, requestTransaction, waitForTransaction } =
    useMidenFiWallet();
  const { showNotification } = useNotification();
  const [reclaimingId, setReclaimingId] = useState<string | null>(null);

  const reclaim = async (
    params: ReclaimParams,
    onConfirmed?: () => void,
  ): Promise<boolean> => {
    const {
      noteId,
      faucetId,
      amount,
      noteType = "public",
      symbol,
      decimals = 6,
      isReclaim = true,
    } = params;

    if (!faucetId) {
      showNotification({
        type: "error",
        title: "Cannot reclaim note",
        message: "Note has no fungible asset / faucet id to reclaim.",
        chainId: "miden",
      });
      return false;
    }
    if (!requestConsume && !requestTransaction) {
      showNotification({
        type: "error",
        title: "Wallet unsupported",
        message: "Connected Miden wallet cannot consume notes.",
        chainId: "miden",
      });
      return false;
    }

    const verb = isReclaim ? "Reclaim" : "Claim";
    const human = symbol
      ? `${formatUnits(amount, decimals)} ${symbol}`
      : `${formatUnits(amount, decimals)} tokens`;
    const short = `${noteId.slice(0, 10)}…${noteId.slice(-6)}`;

    setReclaimingId(noteId);
    showNotification({
      type: "info",
      title: `${verb}ing note`,
      message: `${verb}ing ${human} from note ${short}…`,
      stage: "initiated",
      txHash: `pending-reclaim-${noteId}`,
      chainId: "miden",
      autoHide: false,
    });

    try {
      const amountNumber = Number(amount);
      const { ConsumeTransaction, Transaction } =
        await import("@miden-sdk/miden-wallet-adapter-base");

      let txId: string;
      if (requestConsume) {
        txId = await requestConsume(
          new ConsumeTransaction(faucetId, noteId, noteType, amountNumber),
        );
      } else {
        txId = await requestTransaction!(
          Transaction.createConsumeTransaction(
            faucetId,
            noteId,
            noteType,
            amountNumber,
          ),
        );
      }

      showNotification({
        type: "success",
        title: `${verb} submitted`,
        message: "Waiting for Miden to finalize the transaction…",
        stage: "submitted",
        txHash: txId,
        chainId: "miden",
        autoHide: true,
      });

      if (waitForTransaction) {
        await waitForTransaction(txId, WAIT_TIMEOUT_MS);
      }

      showNotification({
        type: "success",
        title: `${verb} complete`,
        message: `${human} returned to your account.`,
        stage: "confirmed",
        txHash: txId,
        chainId: "miden",
        autoHide: true,
      });
      onConfirmed?.();
      return true;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : `Failed to ${verb.toLowerCase()} note`;
      showNotification({
        type: "error",
        title: `${verb} failed`,
        message:
          /consum|nullifier|spent/i.test(message) &&
          /already|exist|spent/i.test(message)
            ? "Note is already consumed or not yet reclaimable."
            : message,
        chainId: "miden",
      });
      return false;
    } finally {
      setReclaimingId(null);
    }
  };

  return { reclaim, reclaimingId };
}
