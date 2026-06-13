import { ReactNode, useCallback, useRef } from "react";
import { toast } from "sonner";
import { NotificationContext } from "./notification-context";
import { getBlockExplorerTxUrl } from "../utils/chains";

interface NotificationInput {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  stage?: "initiated" | "submitted" | "confirmed";
  txHash?: string;
  chainId?: number | string;
  autoHide?: boolean;
}

function TxHashLink({
  txHash,
  chainId,
}: {
  txHash: string;
  chainId?: number | string;
}) {
  if (!txHash.startsWith("0x")) return null;
  const shortHash = `${txHash.slice(0, 6)}…${txHash.slice(-4)}`;
  const explorerUrl = chainId
    ? getBlockExplorerTxUrl(chainId, txHash)
    : undefined;

  if (!explorerUrl) {
    return (
      <span className="text-xs text-muted-foreground">
        Transaction: {shortHash}
      </span>
    );
  }
  return (
    <span className="text-xs text-muted-foreground">
      Transaction:{" "}
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline-offset-2 hover:underline"
      >
        {shortHash}
      </a>
    </span>
  );
}

/**
 * Same showNotification contract as the original provider, rendered via
 * Sonner. Staged notifications (initiated → submitted → confirmed) update a
 * single toast in place — including the temp "pending-*" id → real txHash
 * handoff the tx flows rely on.
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const stagedToastIdRef = useRef<string | number | null>(null);
  const txToastIdsRef = useRef<Map<string, string | number>>(new Map());

  const showNotification = useCallback((notification: NotificationInput) => {
    const { type, title, message, stage, txHash, chainId, autoHide } =
      notification;
    const duration = autoHide === false ? Infinity : 5000;

    let id: string | number | undefined;
    if (stage) {
      // One staged sequence at a time; every stage replaces the same toast.
      id = stagedToastIdRef.current ?? undefined;
    } else if (txHash) {
      id = txToastIdsRef.current.get(txHash);
    }

    const description = (
      <span className="grid gap-0.5">
        <span>{message}</span>
        {txHash && <TxHashLink txHash={txHash} chainId={chainId} />}
      </span>
    );

    const options = { id, description, duration };
    let toastId: string | number;
    if (stage === "initiated" || stage === "submitted") {
      toastId = toast.loading(title, options);
    } else {
      switch (type) {
        case "success":
          toastId = toast.success(title, options);
          break;
        case "error":
          toastId = toast.error(title, options);
          break;
        case "warning":
          toastId = toast.warning(title, options);
          break;
        default:
          toastId = toast.info(title, options);
      }
    }

    if (stage === "initiated" || stage === "submitted") {
      stagedToastIdRef.current = toastId;
    } else if (stage === "confirmed") {
      stagedToastIdRef.current = null;
    }
    if (txHash) {
      txToastIdsRef.current.set(txHash, toastId);
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}
