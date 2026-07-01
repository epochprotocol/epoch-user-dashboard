import type { MidenClient } from "@miden-sdk/miden-sdk";
import { MIDEN_FAUCET_SEED } from "@/constants/miden-faucets";

/**
 * Lazily-created, process-wide Miden testnet client, **seeded** with
 * MIDEN_FAUCET_SEED so faucet creation is deterministic (same seed + same
 * creation order ⇒ same faucet ids + keys).
 *
 * The Miden SDK is a WASM module — instantiating it is expensive and must happen
 * exactly once per tab, so we memoise the promise. A stable `storeName` keeps the
 * IndexedDB store isolated and reused across reloads.
 */
let clientPromise: Promise<MidenClient> | null = null;

export function getMidenClient(): Promise<MidenClient> {
  if (!clientPromise) {
    clientPromise = (async () => {
      const { MidenClient } = await import("@miden-sdk/miden-sdk");
      return MidenClient.createTestnet({
        seed: MIDEN_FAUCET_SEED,
        storeName: "epoch-dashboard-miden",
        autoSync: true,
      });
    })();
  }
  return clientPromise;
}
