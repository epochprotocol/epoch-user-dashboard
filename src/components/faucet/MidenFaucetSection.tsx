import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MIDEN_TESTNET_FAUCET_URL } from "@/config/web3";

export function MidenFaucetSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Miden</CardTitle>
          <Badge variant="outline">non-EVM</Badge>
        </div>
        <CardDescription>
          Faucet support for epoch tokens on the Miden testnet is on the way.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Use the official Miden testnet faucet to request tokens for your
            Miden account.
          </p>
          <Button
            render={
              <a
                href={MIDEN_TESTNET_FAUCET_URL}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Open Miden faucet
            <ExternalLink data-icon="inline-end" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
