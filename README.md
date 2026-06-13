# Epoch Dashboard

Dashboard for the Epoch Intents protocol on testnets. Built with React + Vite + shadcn/ui.

## Features

- **Overview** — your Compact deposits at a glance: funded / active / unlocking / ready counts, plus a "needs attention" list with live countdowns.
- **Faucets** — mint epoch test tokens (open `mint()` on testnet ERC20s) with preset amounts, wallet balance, "add to wallet" and explorer links. Miden faucet support coming soon.
- **My Funds (force withdraw)** — recover funds locked in The Compact:
  1. **Initiate** — starts the on-chain timelock (~1h05m).
  2. **Wait** — live countdown while the deposit unlocks (cancel anytime to re-enable it for intents).
  3. **Withdraw** — send any amount to any recipient once ready.

## Supported chains

The Epoch allocator is deployed on Sepolia, Base Sepolia and OP Sepolia (testnets), plus Ethereum, Polygon, Optimism, Arbitrum and Base mainnets. The dashboard prompts you to switch when connected elsewhere.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL to your smallocator instance
npm run dev            # http://localhost:3001
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + production build (`dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |

## Deploying

Static SPA — deploy `dist/` anywhere (Vercel, Netlify, Cloudflare Pages). Two requirements:

1. Set `VITE_API_BASE_URL` at build time to a reachable smallocator API.
2. Configure SPA fallback (rewrite all routes to `/index.html`) since routing is client-side.

## Stack

- React 18 + Vite 6 + TypeScript
- Tailwind CSS v4 + shadcn/ui (Base UI primitives), dark theme
- wagmi + viem + RainbowKit for wallet, TanStack Query for data
- `@epoch-protocol/epoch-intents-sdk` for Compact balances, forced withdrawals and allocator API
