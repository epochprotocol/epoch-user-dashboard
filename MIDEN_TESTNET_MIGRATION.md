# Miden test faucets — testnet 0.17

Core SDK 0.17.1; wallet adapters and React SDK 0.17.0. The dashboard uses a new IndexedDB store and the testnet remote prover. Old 0.16 faucet files are preserved.

All tokens below are valueless test assets with 6 decimals. They are distinct from official USDCx. Each faucet received 0.01 official USDCx for fees and confirmed its first 1,000-token mint to inventory (`0xc7a1eb49ff2fb0515b7ccdc58b345c`). A fresh-store import also confirmed a further 1 test USDC mint.

| Token | Faucet | First mint transaction |
|---|---|---|
| USDC | `0x5b043dcb48d5721106f7a1ceb2b804` | `0x4328e6aa6a70e8fc9ed7c14dd26bf80f1d8d70928b5151f50857e6da767219dc` |
| DAI | `0xd41499b8f142ad9119fd9da357a3b2` | `0xd888b7c87ec6297cc4f357f1988be3d29564fb18ad6300cb446e28c92bc3b8c5` |
| USDT | `0x0ead4362a745e7d1790d75ea779611` | `0x23de8df9d9d2010c4f25afb6b9253f0cf634a66f0f32a73909411e5e53b0e61b` |
| WETH | `0x9368815c611d5d517914a2c1f0bc8d` | `0xf6a6f910e64316c5300137c4a377b06c0c468c2a4a0448171831860f7a065f43` |
| WBTC | `0x1b22d80328f58c5171f67a85f170a3` | `0x10a6d5c6ba4efd47ff166ceeb3f0f796890fcae25d400f557e5c30f567becc67` |

The dashboard supports presets of 100/500/1,000 and custom amounts, subject to supply and available USDCx fees. Faucet account files contain public test signing keys by design; use only for these valueless assets.

`npm run miden:faucets:create` reuses the saved identities rather than replacing them. The other services and shared graph have not yet been switched to these custom token IDs; they still need to be aligned before swap tests use these assets. Official USDCx remains the protocol fee asset.

Inventory consumed all 6 notes in confirmed transaction `0x5eea20ea6a82380e5044eb570545ba0e6b18c69124d8e60827d3b8af1dd1c0e1`. Spendable balances: 1,001 test USDC; 1,000 each test DAI, USDT, WETH and WBTC; 0.009762 official USDCx for fees.

Validation: production build, targeted ESLint and formatting checks passed. All five faucets confirmed live mints; USDC account-file import and mint also passed in a fresh SDK store.

Browser minting uses `proverUrl: "testnet"`. Mint refresh/submission is serialized within the tab and retries once only when the node explicitly rejects an expired transaction; transport failures and timeouts are not retried. Regression checks: `node --experimental-strip-types --test scripts/miden-mint-expiry.test.mjs`.

Remote prover browser smoke check: 1 test USDC minted to inventory; confirmed transaction `0xae2c626e8e50db18c47ff02095cd34e3bfc608b58207a602f1dbbdac461b0cc9`. Refresh-to-submission took approximately 2.2 seconds (local proving previously took approximately 30 seconds).
