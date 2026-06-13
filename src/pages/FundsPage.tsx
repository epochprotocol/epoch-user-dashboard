import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { baseSepolia, optimismSepolia, sepolia } from "viem/chains";
import { Info, TriangleAlert } from "lucide-react";
import { ALLOCATOR_ADDRESS } from "@epoch-protocol/epoch-intents-sdk";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DepositsTable } from "@/components/funds/DepositsTable";
import { getChainName } from "../utils/chains";

const SUPPORTED_TESTNETS = [sepolia, baseSepolia, optimismSepolia];

export default function FundsPage() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const isChainSupported = !!ALLOCATOR_ADDRESS[chainId];

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Funds</CardTitle>
          <CardDescription>
            Connect your wallet to see deposits locked in The Compact.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!isChainSupported) {
    return (
      <div className="grid gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">My Funds</h2>
          <p className="text-sm text-muted-foreground">
            Withdraw your locked deposits from The Compact.
          </p>
        </div>
        <Alert>
          <TriangleAlert />
          <AlertTitle>
            The Epoch allocator is not deployed on {getChainName(chainId)}
          </AlertTitle>
          <AlertDescription>
            <p className="mb-3">
              Switch to a supported chain to see your deposits:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_TESTNETS.map((chain) => (
                <Button
                  key={chain.id}
                  variant="outline"
                  size="sm"
                  disabled={isSwitching}
                  onClick={() => switchChain({ chainId: chain.id })}
                >
                  {chain.name}
                </Button>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">My Funds</h2>
        <p className="text-sm text-muted-foreground">
          Withdraw your locked deposits from The Compact on{" "}
          {getChainName(chainId)}.
        </p>
      </div>

      <Alert>
        <Info />
        <AlertTitle>How forced withdrawals work</AlertTitle>
        <AlertDescription>
          Deposits are locked so they can back intents. To take funds out,
          initiate a forced withdrawal — after a short timelock the deposit
          becomes withdrawable to any address. You can cancel anytime to use the
          deposit for intents again.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Deposits</CardTitle>
          <CardDescription>
            Compact balances for the connected wallet on the current chain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DepositsTable />
        </CardContent>
      </Card>
    </div>
  );
}
