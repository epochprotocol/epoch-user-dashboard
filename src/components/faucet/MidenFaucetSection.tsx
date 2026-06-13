import { Hourglass } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MidenFaucetSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Miden</CardTitle>
          <Badge variant="outline">non-EVM</Badge>
          <Badge variant="secondary">Coming soon</Badge>
        </div>
        <CardDescription>
          Faucet support for epoch tokens on the Miden testnet is on the way.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Hourglass className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium">Miden faucet coming soon</p>
          <p className="max-w-md text-xs text-muted-foreground">
            We are working on minting epoch test tokens directly to Miden
            accounts. Until then, use the EVM tokens tab.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
