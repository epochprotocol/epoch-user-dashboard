import { ReclaimMidenSection } from "@/components/reclaim/ReclaimMidenSection";

export default function ReclaimPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Reclaim</h2>
        <p className="text-sm text-muted-foreground">
          Recover stuck Miden notes — reclaim collateral from intents that never
          settled.
        </p>
      </div>

      <ReclaimMidenSection />
    </div>
  );
}
