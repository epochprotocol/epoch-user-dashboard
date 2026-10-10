import { test } from "node:test";
import assert from "node:assert/strict";
import { mintWithExpiryRecovery } from "../src/lib/midenMint.ts";
const expired = () =>
  new Error(
    "failed to submit proven transaction: RPC error: grpc request failed for submit_proven_transaction: invalid request parameters (transaction expired): transaction expired at block height 50447 but the block height limit was 50449",
  );
test("refreshes and rebuilds once after an explicit expiry rejection", async () => {
  const events = [];
  let attempts = 0;
  const result = await mintWithExpiryRecovery(
    async () => events.push("refresh"),
    async () => {
      events.push("submit");
      if (attempts++ === 0) throw expired();
      return "confirmed-tx";
    },
  );
  assert.equal(result, "confirmed-tx");
  assert.deepEqual(events, ["refresh", "submit", "refresh", "submit"]);
});
test("does not retry an ambiguous transport failure", async () => {
  let attempts = 0;
  await assert.rejects(
    mintWithExpiryRecovery(
      async () => {},
      async () => {
        attempts++;
        throw Error("request timed out after submission");
      },
    ),
    /timed out/,
  );
  assert.equal(attempts, 1);
});
test("stops after the second explicit expiry", async () => {
  let attempts = 0;
  await assert.rejects(
    mintWithExpiryRecovery(
      async () => {},
      async () => {
        attempts++;
        throw expired();
      },
    ),
    /transaction expired/,
  );
  assert.equal(attempts, 2);
});
test("serializes refresh and submission across concurrent mint calls", async () => {
  const events = [];
  let release;
  const hold = new Promise((resolve) => (release = resolve));
  const a = mintWithExpiryRecovery(
    async () => events.push("refresh-a"),
    async () => {
      events.push("submit-a");
      await hold;
      events.push("done-a");
    },
  );
  const b = mintWithExpiryRecovery(
    async () => events.push("refresh-b"),
    async () => events.push("submit-b"),
  );
  await new Promise((resolve) => setImmediate(resolve));
  release();
  await Promise.all([a, b]);
  assert.deepEqual(events, [
    "refresh-a",
    "submit-a",
    "done-a",
    "refresh-b",
    "submit-b",
  ]);
});
