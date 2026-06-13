import { useState } from "react";
import { useChainId } from "wagmi";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useEpochSdk } from "@/hooks/useEpochSdk";
import { useNotification } from "@/hooks/useNotification";
import type { DepositRow } from "@/hooks/useDepositedBalances";

interface CancelWithdrawalDialogProps {
  row: DepositRow;
  onClose: () => void;
  onSuccess: () => void;
}

export function CancelWithdrawalDialog({
  row,
  onClose,
  onSuccess,
}: CancelWithdrawalDialogProps) {
  const sdk = useEpochSdk();
  const chainId = useChainId();
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    if (!sdk) return;
    setIsSubmitting(true);
    try {
      const result = await sdk.disableForcedWithdrawal(row.depositId);
      showNotification({
        type: "success",
        title: "Forced withdrawal disabled",
        message: "This deposit can be used for intents again.",
        txHash: result.transactionHash,
        chainId,
        autoHide: true,
      });
      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Disable failed";
      if (!message.toLowerCase().includes("user rejected")) {
        showNotification({
          type: "error",
          title: "Disable failed",
          message,
          chainId,
          autoHide: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog
      open
      onOpenChange={(open) => !open && !isSubmitting && onClose()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Re-enable {row.symbol} deposit for intents?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This cancels the forced withdrawal and makes the deposit usable for
            intents again. If you change your mind, you can initiate a new
            withdrawal later — the timelock starts over.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Keep withdrawing
          </Button>
          <Button onClick={handleCancel} disabled={isSubmitting || !sdk}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Cancelling…" : "Re-enable deposit"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
