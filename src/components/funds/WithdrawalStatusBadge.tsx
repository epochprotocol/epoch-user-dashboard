import { CheckCircle2, Clock, Lock } from "lucide-react";
import type { ForcedWithdrawalStatus } from "@epoch-protocol/epoch-intents-sdk";
import { Badge } from "@/components/ui/badge";

interface WithdrawalStatusBadgeProps {
  status: ForcedWithdrawalStatus;
}

export function WithdrawalStatusBadge({ status }: WithdrawalStatusBadgeProps) {
  if (status === "Pending") {
    return (
      <Badge
        variant="outline"
        className="border-amber-500/40 bg-amber-500/10 text-amber-400"
      >
        <Clock data-icon="inline-start" />
        Unlocking
      </Badge>
    );
  }
  if (status === "Enabled") {
    return (
      <Badge variant="default">
        <CheckCircle2 data-icon="inline-start" />
        Ready to withdraw
      </Badge>
    );
  }
  return (
    <Badge variant="secondary">
      <Lock data-icon="inline-start" />
      Active
    </Badge>
  );
}
