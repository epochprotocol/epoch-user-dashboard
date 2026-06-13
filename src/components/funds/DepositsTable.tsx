import { useState } from "react";
import { Inbox, RotateCcw, TriangleAlert } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDepositedBalances,
  type DepositRow,
} from "@/hooks/useDepositedBalances";
import { WithdrawalStatusBadge } from "./WithdrawalStatusBadge";
import { Countdown } from "./Countdown";
import { InitiateWithdrawalDialog } from "./InitiateWithdrawalDialog";
import { CancelWithdrawalDialog } from "./CancelWithdrawalDialog";
import { WithdrawDialog } from "./WithdrawDialog";

type DialogState = {
  type: "initiate" | "cancel" | "withdraw";
  row: DepositRow;
} | null;

function formatBalance(balance: string): string {
  return parseFloat(balance).toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
}

export function DepositsTable() {
  const {
    data: rows,
    isLoading,
    isError,
    error,
    refetch,
    invalidate,
  } = useDepositedBalances();
  const [dialog, setDialog] = useState<DialogState>(null);

  const closeDialog = () => setDialog(null);

  // Hide untouched zero-balance locks; keep anything with funds or an
  // in-flight withdrawal.
  const visibleRows = rows?.filter(
    (row) => parseFloat(row.balance) > 0 || row.withdrawStatus !== "Disabled",
  );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead className="text-right">Deposited</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-px text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            !rows &&
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-8 w-28" />
                </TableCell>
              </TableRow>
            ))}

          {isError && (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <TriangleAlert className="size-8 text-destructive" />
                  <p className="text-sm font-medium">Could not load deposits</p>
                  <p className="max-w-md text-xs text-muted-foreground">
                    {error instanceof Error ? error.message : "Unknown error"}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void refetch()}
                  >
                    Retry
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            !isError &&
            (!visibleRows || visibleRows.length === 0) && (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <Inbox className="size-8 text-muted-foreground" />
                    <p className="text-sm font-medium">No deposits found</p>
                    <p className="text-xs text-muted-foreground">
                      Deposits you make into The Compact on this chain will show
                      up here. Mint test tokens at the faucet first if you have
                      none.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}

          {visibleRows?.map((row) => (
            <TableRow key={row.depositId}>
              <TableCell>
                <div className="grid gap-0.5">
                  <span className="font-medium">{row.symbol}</span>
                  <span
                    className="max-w-32 truncate font-mono text-xs text-muted-foreground"
                    title={row.depositId}
                  >
                    #{row.depositId}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {formatBalance(row.balance)} {row.symbol}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <WithdrawalStatusBadge status={row.withdrawStatus} />
                  {row.withdrawStatus === "Pending" &&
                    row.availableAt !== null && (
                      <Countdown
                        availableAt={row.availableAt}
                        onElapsed={invalidate}
                      />
                    )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  {row.withdrawStatus === "Disabled" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={parseFloat(row.balance) <= 0}
                      onClick={() => setDialog({ type: "initiate", row })}
                    >
                      Initiate withdrawal
                    </Button>
                  )}
                  {row.withdrawStatus === "Pending" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDialog({ type: "cancel", row })}
                    >
                      <RotateCcw data-icon="inline-start" />
                      Cancel
                    </Button>
                  )}
                  {row.withdrawStatus === "Enabled" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => setDialog({ type: "withdraw", row })}
                      >
                        Withdraw
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDialog({ type: "cancel", row })}
                      >
                        Re-enable
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {dialog?.type === "initiate" && (
        <InitiateWithdrawalDialog
          row={dialog.row}
          onClose={closeDialog}
          onSuccess={invalidate}
        />
      )}
      {dialog?.type === "cancel" && (
        <CancelWithdrawalDialog
          row={dialog.row}
          onClose={closeDialog}
          onSuccess={invalidate}
        />
      )}
      {dialog?.type === "withdraw" && (
        <WithdrawDialog
          row={dialog.row}
          onClose={closeDialog}
          onSuccess={invalidate}
        />
      )}
    </>
  );
}
