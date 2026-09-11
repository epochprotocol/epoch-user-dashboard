import type { MidenClient } from "@miden-sdk/miden-sdk";

let clientPromise: Promise<MidenClient> | null = null;

const RPC_URL = import.meta.env.VITE_MIDEN_RPC_URL?.trim();
const NOTE_TRANSPORT_URL =
  import.meta.env.VITE_MIDEN_NOTE_TRANSPORT_URL?.trim();

export const MIDEN_EXPLORER_URL = "https://testnet.midenscan.com";

export function getMidenClient(): Promise<MidenClient> {
  if (!RPC_URL || !NOTE_TRANSPORT_URL) {
    throw new Error(
      "VITE_MIDEN_RPC_URL and VITE_MIDEN_NOTE_TRANSPORT_URL are required",
    );
  }

  if (!clientPromise) {
    clientPromise = (async () => {
      const { MidenClient } = await import("@miden-sdk/miden-sdk");
      return MidenClient.create({
        rpcUrl: RPC_URL,
        noteTransportUrl: NOTE_TRANSPORT_URL,
        // Separate from legacy and worker-backed stores.
        storeName: "epoch-dashboard-miden-testnet-faucets-local",
        autoSync: true,
        // Faucet imports and mint execution must share one IndexedDB client.
        useWorker: false,
      });
    })();
  }
  return clientPromise;
}

export function resetMidenClient(): void {
  clientPromise = null;
}
