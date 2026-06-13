import { Link } from "react-router-dom";
import { useAccount, useChainId } from "wagmi";
import {
  ArrowRight,
  CheckCircle2,
  Droplets,
  Layers,
  Lock,
  Timer,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Countdown } from "@/components/funds/Countdown";
import { WithdrawalStatusBadge } from "@/components/funds/WithdrawalStatusBadge";
import { useDepositedBalances } from "@/hooks/useDepositedBalances";
import { getChainName } from "../utils/chains";

function StatCard({
  title,
  value,
  icon: Icon,
  highlight = false,
}: {
  title: string;
  value: string | number;
  icon: typeof Lock;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-primary/40" : undefined}>
      <CardContent className="flex items-center gap-3">
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
            highlight ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          <Icon className="size-4" />
        </div>
        <div className="grid gap-0.5">
          <span className="text-xs text-muted-foreground">{title}</span>
          <span className="text-lg font-semibold tabular-nums">{value}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OverviewPage() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { data: rows, isLoading, invalidate } = useDepositedBalances();

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Epoch Dashboard</CardTitle>
          <CardDescription>
            Connect your wallet (top right) to see your Compact deposits, mint
            test tokens, and manage withdrawals.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const funded = rows?.filter((r) => parseFloat(r.balance) > 0) ?? [];
  const active = funded.filter((r) => r.withdrawStatus === "Disabled");
  const unlocking = funded.filter((r) => r.withdrawStatus === "Pending");
  const ready = funded.filter((r) => r.withdrawStatus === "Enabled");
  const needsAttention = [...ready, ...unlocking];

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Your Compact deposits on {getChainName(chainId)} at a glance.
        </p>
      </div>

      {isLoading && !rows ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-lg" />
                <div className="grid gap-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Funded deposits"
            value={funded.length}
            icon={Layers}
          />
          <StatCard
            title="Active for intents"
            value={active.length}
            icon={Lock}
          />
          <StatCard title="Unlocking" value={unlocking.length} icon={Timer} />
          <StatCard
            title="Ready to withdraw"
            value={ready.length}
            icon={CheckCircle2}
            highlight={ready.length > 0}
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Needs attention</CardTitle>
            {needsAttention.length > 0 && (
              <Badge variant="default">{needsAttention.length}</Badge>
            )}
          </div>
          <CardDescription>
            Withdrawals in progress or waiting for you to act.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {needsAttention.length === 0 && (
            <p className="text-sm text-muted-foreground">
              All clear — no withdrawals pending.
            </p>
          )}
          {needsAttention.map((row) => (
            <div
              key={row.depositId}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{row.symbol}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {parseFloat(row.balance).toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}
                </span>
                <WithdrawalStatusBadge status={row.withdrawStatus} />
                {row.withdrawStatus === "Pending" &&
                  row.availableAt !== null && (
                    <Countdown
                      availableAt={row.availableAt}
                      onElapsed={invalidate}
                    />
                  )}
              </div>
              <Button variant="outline" size="sm" render={<Link to="/funds" />}>
                Manage
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="size-4 text-primary" />
              Need test tokens?
            </CardTitle>
            <CardDescription>
              Mint epoch test tokens on any supported testnet, or grab Miden
              faucet IDs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" render={<Link to="/faucets" />}>
              Open faucets
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="size-4 text-primary" />
              Locked funds
            </CardTitle>
            <CardDescription>
              View your Compact deposits and withdraw them with a forced
              withdrawal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" render={<Link to="/funds" />}>
              Manage funds
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
