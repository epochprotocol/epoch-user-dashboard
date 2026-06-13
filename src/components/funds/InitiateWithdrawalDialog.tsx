import { useState } from "react";
import { useChainId } from "wagmi";
import { Loader2, TriangleAlert } from "lucide-react";
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

interface InitiateWithdrawalDialogProps {
  row: DepositRow;
  onClose: () => void;
  onSuccess: () => void;
}

const STEPS = [
  { label: "Initiate", detail: "Sign a transaction to start the timelock" },
  { label: "Wait", detail: "Deposit is locked for intents while unlocking" },
  { label: "Withdraw", detail: "Send tokens to any recipient once ready" },
];

export function InitiateWithdrawalDialog({
  row,
  onClose,
  onSuccess,
}: InitiateWithdrawalDialogProps) {
  const sdk = useEpochSdk();
  const chainId = useChainId();
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInitiate = async () => {
    if (!sdk) return;
    setIsSubmitting(true);
    try {
      const result = await sdk.initateDepositWithdrawal(row.depositId);
      showNotification({
        type: "success",
        title: "Withdrawal initiated",
        message:
          "Timelock started. You can withdraw once the countdown completes.",
        txHash: result.transactionHash,
        chainId,
        autoHide: true,
      });
      onSuccess();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Initiate withdrawal failed";
      if (!message.toLowerCase().includes("user rejected")) {
        showNotification({
          type: "error",
          title: "Initiate failed",
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
            Initiate forced withdrawal of {row.symbol}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This starts a timelock on your {row.balance} {row.symbol} deposit.
            While unlocking, this deposit cannot be used for intents.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ol className="space-y-3">
          {STEPS.map((step, i) => (
            <li key={step.label} className="flex items-start gap-3">
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  i === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              <div className="grid gap-0.5">
                <span className="text-sm font-medium leading-6">
                  {step.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {step.detail}
                </span>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-400">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p>
            You can cancel at any time to re-enable this deposit for intents,
            but the timelock restarts if you initiate again.
          </p>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleInitiate} disabled={isSubmitting || !sdk}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Initiating…" : "Initiate withdrawal"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
