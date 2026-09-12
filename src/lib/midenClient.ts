import type { MidenClient } from "@miden-sdk/miden-sdk";

let clientPromise: Promise<MidenClient> | null = null;

export class MidenOperationTimeoutError extends Error {
  constructor(operation: string, timeoutMs: number) {
    super(
      `Miden ${operation} timed out after ${Math.ceil(timeoutMs / 1000)} seconds`,
    );
    this.name = "MidenOperationTimeoutError";
  }
}

export const MIDEN_EXPLORER_URL = "https://testnet.midenscan.com";

export function getMidenClient(): Promise<MidenClient> {
  if (!clientPromise) {
    clientPromise = (async () => {
      const { MidenClient } = await import("@miden-sdk/miden-sdk");
      return MidenClient.createTestnet({
        // Separate from legacy faucet stores while preserving the same store for
        // all mint operations in this tab.
        storeName: "epoch-dashboard-miden-testnet-faucets-local",
        // Sync explicitly around minting so an unavailable RPC cannot leave
        // client initialization pending forever.
        autoSync: false,
        // The worker keeps WASM sync/proving work off React's main thread.
        useWorker: true,
      });
    })();
  }
  return clientPromise;
}

export function resetMidenClient(): void {
  // Terminate a completed (or eventually completed) worker before allowing a
  // retry. This prevents a timed-out operation from keeping the UI thread busy.
  void clientPromise?.then((client) => client.terminate()).catch(() => {});
  clientPromise = null;
}

/**
 * Bounds SDK work that can otherwise wait indefinitely on the Miden RPC or NTL.
 * The SDK does not expose an AbortSignal for these calls, so callers should reset
 * the client after this rejects before offering another mint attempt.
 */
export function withMidenTimeout<T>(
  operation: string,
  work: () => Promise<T>,
  timeoutMs: number,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new MidenOperationTimeoutError(operation, timeoutMs)),
      timeoutMs,
    );

    void work().then(
      (result) => {
        window.clearTimeout(timeout);
        resolve(result);
      },
      (error: unknown) => {
        window.clearTimeout(timeout);
        reject(error);
      },
    );
  });
}
