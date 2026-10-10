let mintQueue: Promise<void> = Promise.resolve();

/** Serialize refresh/submission and rebuild once after an explicit expiry rejection. */
export function mintWithExpiryRecovery<T>(
  refresh: () => Promise<void>,
  submit: () => Promise<T>,
): Promise<T> {
  const run = async () => {
    await refresh();
    try {
      return await submit();
    } catch (error) {
      // An explicit node rejection means this transaction was not accepted.
      // Timeouts and other ambiguous submission failures must never be retried.
      if (
        !(error instanceof Error) ||
        !error.message.includes("failed to submit proven transaction") ||
        !error.message.includes(
          "invalid request parameters (transaction expired)",
        )
      ) {
        throw error;
      }
      await refresh();
      return submit();
    }
  };
  const result = mintQueue.then(run);
  mintQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}
