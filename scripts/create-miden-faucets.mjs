/** Create reusable, valueless Miden 0.17 testnet faucets. Never use these public keys for valuable assets. */
import { readFile, writeFile, copyFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { MidenClient, FaucetType, AccountFile } from "@miden-sdk/miden-sdk";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILES = path.join(ROOT, "src/constants/miden-faucet-files.json");
const IDS = path.join(ROOT, "src/constants/miden-faucet-ids.testnet-0.17.json");
const RPC = "https://rpc.testnet.miden.io";
const TRANSPORT = "https://transport.miden.io";
const SYMBOLS = ["USDC", "DAI", "USDT", "WETH", "WBTC"];
const DECIMALS = 6;
async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (await exists(IDS)) {
    console.log(
      "Using existing 0.17 faucet identities:",
      JSON.parse(await readFile(IDS, "utf8")),
    );
    return;
  }
  const client = await MidenClient.create({
    rpcUrl: RPC,
    noteTransportUrl: TRANSPORT,
    storeName: "epoch-dashboard-testnet-v0171-faucet-setup",
    autoSync: false,
    proverUrl: "testnet",
  });
  try {
    await client.sync();
    const ids = {};
    const files = {};
    for (const symbol of SYMBOLS) {
      const account = await client.accounts.create({
        type: FaucetType.FungibleFaucet,
        name: `Epoch Test ${symbol}`,
        symbol,
        decimals: DECIMALS,
        maxSupply: 1_000_000_000n * 10n ** BigInt(DECIMALS),
        storage: "public",
      });
      const id = account.id().toString();
      const file = await client.accounts.export(id);
      const bytes = file.serialize();
      if (AccountFile.deserialize(bytes).accountId().toString() !== id)
        throw new Error(`${symbol}: export round-trip failed`);
      ids[symbol] = id;
      files[symbol] = Buffer.from(bytes).toString("base64");
      console.log(`${symbol}: ${id}`);
    }
    const backup = path.join(
      ROOT,
      "src/constants/miden-faucet-files.testnet-0.16.json",
    );
    if ((await exists(FILES)) && !(await exists(backup)))
      await copyFile(FILES, backup);
    await writeFile(FILES, JSON.stringify(files, null, 2) + "\n");
    await writeFile(IDS, JSON.stringify(ids, null, 2) + "\n");
    console.log(
      "Saved reusable 0.17 testnet faucet files. Fund their USDCx fees and mint to publish them on-chain.",
    );
  } finally {
    await client.terminate();
  }
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
