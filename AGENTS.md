# AGENTS.md

## Cursor Cloud specific instructions

`epoch-user-dashboard` is a Vite/React SPA (The Compact deposits, Miden faucets, withdrawals) that talks to the `smallocator` allocator API. It is the most reliable runnable reference UI in this workspace.

Dependencies are installed automatically by the Cursor Cloud startup update script (this repo uses npm) — do not re-run installs to "set up" the repo.

### Run / build / lint
- Create `.env` from `.env.example`: `VITE_API_BASE_URL=http://localhost:3000` (points at `smallocator`) and `VITE_MIDEN_FAUCET_SEED=...`. `.env` is gitignored.
- Run: `npm run dev` (Vite on `:3001`). Build: `npm run build` (`tsc -b && vite build`). Lint: `npm run lint`.
- The page loads and renders (and reads `smallocator` config) without a wallet.

### Behavior notes
- All core actions (Overview / Faucets / My Funds, deposits, withdrawals, EVM faucet mints) are gated behind an **EVM wallet connection** via RainbowKit/wagmi. The cloud VM's browser has no wallet extension, so those flows cannot be exercised headlessly; verify UI rendering and API/config wiring instead.
- The sibling `epoch-widget/demo` app currently fails to boot due to registry version drift (its source imports `getMLHBridgeAdapters`, which is absent from the published `@epoch-protocol/epoch-intent-widget@0.1.3`). Prefer this dashboard as the runnable UI until that is reconciled.

### Local stack ports
`smallocator` API `:3000`, `epoch-sio` `:8080`, swap/bridge solver `:3002`, epoch-user-dashboard `:3001`.
