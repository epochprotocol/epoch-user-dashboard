import { useState } from "react";
import { isAddress, parseUnits } from "viem";
import { useAccount, useChainId } from "wagmi";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEpochSdk } from "@/hooks/useEpochSdk";
import { useNotification } from "@/hooks/useNotification";
import type { DepositRow } from "@/hooks/useDepositedBalances";

interface WithdrawDialogProps {
  row: DepositRow;
  onClose: () => void;
  onSuccess: () => void;
}

export function WithdrawDialog({
  row,
  onClose,
  onSuccess,
}: WithdrawDialogProps) {
  const sdk = useEpochSdk();
  const chainId = useChainId();
  const { address } = useAccount();
  const { showNotification } = useNotification();

  const [amount, setAmount] = useState(row.balance);
  const [recipient, setRecipient] = useState(address ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amountNum = amount ? parseFloat(amount) : 0;
  const maxNum = parseFloat(row.balance);
  const isValidAmount =
    amountNum > 0 &&
    amountNum <= maxNum &&
    (amount.split(".")[1]?.length ?? 0) <= row.decimals;
  const isValidRecipient = isAddress(recipient);
  const canWithdraw =
    isValidAmount && isValidRecipient && !isSubmitting && !!sdk;

  const handleWithdraw = async () => {
    if (!canWithdraw || !sdk) return;
    setIsSubmitting(true);
    try {
      const amountWei = parseUnits(amount, row.decimals).toString();
      const result = await sdk.withdrawToken(
        row.depositId,
        recipient,
        amountWei,
      );
      showNotification({
        type: "success",
        title: "Withdrawal submitted",
        message: `Sending ${amount} ${row.symbol} to ${recipient.slice(0, 10)}…`,
        txHash: result.transactionHash,
        chainId,
        autoHide: true,
      });
      onSuccess();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Withdrawal failed";
      if (!message.toLowerCase().includes("user rejected")) {
        showNotification({
          type: "error",
          title: "Withdrawal failed",
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
    <Dialog open onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw {row.symbol}</DialogTitle>
          <DialogDescription>
            The timelock has elapsed — send tokens from The Compact to any
            address.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="withdraw-amount">Amount</Label>
            <div className="flex gap-2">
              <Input
                id="withdraw-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setAmount(row.balance)}
                disabled={isSubmitting}
              >
                Max
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Available: {row.balance} {row.symbol}
            </p>
            {amount && !isValidAmount && (
              <p className="text-xs text-destructive">
                Invalid amount (max {row.balance} {row.symbol})
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="withdraw-recipient">Recipient</Label>
            <Input
              id="withdraw-recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x…"
              className="font-mono"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Defaults to your connected wallet.
            </p>
            {recipient && !isValidRecipient && (
              <p className="text-xs text-destructive">Invalid address</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleWithdraw} disabled={!canWithdraw}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Withdrawing…" : "Withdraw"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
