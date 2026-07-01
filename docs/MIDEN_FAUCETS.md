# Miden faucets (testnet airdrop)

The **Miden** tab on the Faucets page mints test tokens to a user's Miden account
with **no backend**. Faucets are driven by a single **seed** — no account-file
blobs are stored.

---

## 1. The core idea

On EVM, our test tokens have an open `mint()`, so the dashboard mints client-side
with a normal wallet tx.

On **Miden**, a token is a **fungible faucet account**, and minting must be signed
by that faucet's key. We get the key from a **seed**:

- The in-browser Miden client is created **seeded** with `VITE_MIDEN_FAUCET_SEED`.
  Miden uses it to seed the account-init RNG.
- Creating the faucets in a fixed order (`MIDEN_FAUCETS`) is therefore
  **deterministic**: same seed + same order ⇒ same faucet ids and the same signing
  keys, in any browser. The keys land in the client's keystore, so it can mint.

So the seed is the only thing to manage. No `AccountFile` blobs, no JSON.

```
browser (dashboard), client seeded with VITE_MIDEN_FAUCET_SEED
  ensureFaucets()  → create faucets in order → ids + keys (deterministic)
  transactions.mint({ account: faucetId, to: user })  → public P2ID note
  client.sync()
                                   user's Miden wallet syncs, consumes the note
```

### ORDER MATTERS

The client RNG advances on every account creation, so faucet N only reproduces if
faucets 1..N-1 were created first. **`MIDEN_FAUCETS` is append-only** — never
reorder or delete entries in the middle, or downstream ids change.

### Security

The seed is the faucet **master key**. As a `VITE_` var it is **inlined into the
public bundle** — it is NOT secret (an `.env` is no safer than committing it;
nothing in a frontend is). Acceptable ONLY for valueless testnet faucets. **Never**
use this seed on mainnet or for any account holding value.

There is no "create faucet" button in the user UI — users can't spawn faucets.

---

## 2. Files

| File | Role |
|------|------|
| `src/constants/miden-faucets.ts` | `MIDEN_FAUCETS` list (symbol, decimals, maxSupply), the seed, helpers. |
| `src/lib/midenClient.ts` | Seeded `MidenClient.createTestnet({ seed })`. |
| `src/lib/midenFaucets.ts` | `ensureFaucets()` — derives all faucets in order, caches ids in localStorage. |
| `src/hooks/useMidenFaucetMint.ts` | Derives + `transactions.mint` + `sync`. |
| `src/components/faucet/MidenFaucetCard.tsx` / `MidenFaucetSection.tsx` | UI. |
| `src/pages/dev/CreateMidenFaucetsPage.tsx` | DEV-only: create/derive faucets, show ids. |

---

## 3. Setup

1. Set the seed (already in `.env.example`):
   ```
   VITE_MIDEN_FAUCET_SEED=epoch-dashboard-miden-testnet-faucets-v1
   ```
   Any string; the SDK hashes it to 32 bytes. Restart the dev server after changes.
2. `npm install && npm run dev`.
3. Open **/dev/miden-faucets**, click **Create / derive faucets** once — this
   deploys them on testnet. (Optional: copy the id block into `MIDEN_FAUCETS` for
   explorer links; minting doesn't need it.)
4. Done. The Miden tab mints. `MIDEN_FAUCETS_CONFIGURED` (= seed present) gates the
   UI.

To add a token: **append** to `MIDEN_FAUCETS` (never insert/reorder), re-derive.

---

## 4. How a user mints

Miden tab → paste Miden account id (`0x…` or `mtst1…`) → pick token + amount →
**Mint**. A public note is emitted; they sync their Miden wallet to consume it.

> The Faucets page currently needs an EVM wallet connected to render (shared gate
> with the EVM tab). Loosening that is a follow-up.

---

## 5. Determinism caveat (verify once)

The seed→faucet reproducibility across a *fresh* browser is the load-bearing
assumption. **Verify it once**: create the faucets, then open the dashboard in a
clean profile/incognito (same seed) and mint — the derived ids must match and the
mint must succeed. If a fresh browser can't mint, the fallback is to commit the
faucet ids (and, if needed, keys) instead of relying purely on the seed.

`ensureFaucets()` caches ids in `localStorage` and the keys live in IndexedDB, so
after the first derivation a browser reuses them. "Force re-derive" on the dev page
clears the cache.

---

## 6. Cross-repo mapping (for swaps, not the dashboard mint)

The dashboard mint is self-contained. For these tokens to work in the **intent /
swap flow**, register each faucet id (from the dev page) in: the epoch graph
(`data/epochgraphtestnet.json`, in both SDKs) with `decimalsByChain.Miden: 6`,
`dex-solver` `INPUT_SUPPORTED_TOKENS`, and `miden-integration-example`
`MIDEN_FAUCET_DECIMALS`. `epoch-sio` needs nothing extra.

---

## 7. FAQ

**Why a seed instead of stored account files?** One value (the seed) regenerates
every faucet's id + key, so there are no multi-KB blobs to commit and faucets are
easy to recreate/manage.

**Is `.env` safer than committing it?** No. Vite inlines `VITE_` vars into the
public bundle. Nothing in a frontend is secret — only a backend hides a key.

**Can users create faucets?** No. Creation only exists on the dev-only page.
