# Graph Report - epoch-dashboard  (2026-10-08)

## Corpus Check
- 125 files · ~63,945 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 787 nodes · 1396 edges · 67 communities (47 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `63dfcd6f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DepositsTable.tsx
- ReclaimMidenSection.tsx
- dependencies
- main.tsx
- devDependencies
- compilerOptions
- useMidenFaucetMint.ts
- web3.ts
- components.json
- sidebar.tsx
- What You Must Do When Invoked
- cn
- dropdown-menu.tsx
- What You Must Do When Invoked
- compilerOptions
- sheet.tsx
- AppLayout.tsx
- tsconfig.json
- What You Must Do When Invoked
- package.json
- vercel.json
- What You Must Do When Invoked
- Miden faucets (testnet airdrop)
- AppSidebar.tsx
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- graphify reference: extra exports and benchmark
- Epoch Dashboard
- create-miden-faucets.mjs
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- graphify.js
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- CLAUDE.md
- .claude/CLAUDE.md
- .claude/skills/graphify/references/extraction-spec.md
- .codex/skills/graphify/references/extraction-spec.md
- .opencode/skills/graphify/references/extraction-spec.md
- agent/skills/graphify/references/extraction-spec.md
- scripts
- vite.config.ts
- MIDEN_TESTNET_MIGRATION.md

## God Nodes (most connected - your core abstractions)
1. `cn()` - 110 edges
2. `react` - 38 edges
3. `compilerOptions` - 25 edges
4. `lucide-react` - 22 edges
5. `Button()` - 19 edges
6. `wagmi` - 14 edges
7. `useNotification()` - 13 edges
8. `@miden-sdk/miden-sdk` - 12 edges
9. `What You Must Do When Invoked` - 12 edges
10. `What You Must Do When Invoked` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogMedia()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogAction()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogCancel()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (67 total, 18 thin omitted)

### Community 0 - "DepositsTable.tsx"
Cohesion: 0.07
Nodes (47): @epoch-protocol/epoch-intents-sdk, wagmi, CancelWithdrawalDialog(), CancelWithdrawalDialogProps, Countdown(), CountdownProps, formatRemaining(), DepositsTable() (+39 more)

### Community 1 - "ReclaimMidenSection.tsx"
Cohesion: 0.10
Nodes (47): class-variance-authority, lucide-react, react, EvmFaucetCard(), PRESET_AMOUNTS, MidenFaucetCard(), MidenFaucetCardProps, PRESET_AMOUNTS (+39 more)

### Community 2 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, @base-ui/react, class-variance-authority, clsx, @epoch-protocol/epoch-commons-sdk, @epoch-protocol/epoch-intents-sdk, @fontsource-variable/geist, lucide-react (+18 more)

### Community 3 - "main.tsx"
Cohesion: 0.06
Nodes (36): @rainbow-me/rainbowkit, sonner, @tanstack/react-query, AppLayout(), ReclaimMidenSection(), Toaster(), WalletConnect(), WalletConnectProps (+28 more)

### Community 4 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, eslint, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, prettier, @types/node (+9 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (27): compilerOptions, allowImportingTsExtensions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx (+19 more)

### Community 6 - "useMidenFaucetMint.ts"
Cohesion: 0.08
Nodes (39): @miden-sdk/miden-sdk, @miden-sdk/miden-wallet-adapter-base, @miden-sdk/miden-wallet-adapter-react, viem, ReclaimByIdCard(), base64ToBytes(), bytesToBase64(), hasAllFaucetFiles() (+31 more)

### Community 7 - "web3.ts"
Cohesion: 0.09
Nodes (22): @epoch-protocol/epoch-commons-sdk, EvmFaucetCardProps, ChainInfo, EpochGraph, getChainNameByChainId(), getGraphForChain(), getTokensForChain(), GraphChain (+14 more)

### Community 8 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 9 - "sidebar.tsx"
Cohesion: 0.11
Nodes (18): SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroupAction(), SidebarGroupLabel(), SidebarInput(), SidebarMenuAction(), SidebarMenuBadge() (+10 more)

### Community 10 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 11 - "cn"
Cohesion: 0.17
Nodes (18): AlertAction(), CardAction(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton() (+10 more)

### Community 12 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, noEmit, skipLibCheck, strict (+1 more)

### Community 15 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 16 - "AppLayout.tsx"
Cohesion: 0.33
Nodes (5): react-router-dom, PAGE_TITLES, AppSidebar(), Separator(), SidebarInset()

### Community 17 - "tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, files, references

### Community 18 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 19 - "package.json"
Cohesion: 0.07
Nodes (26): name, private, type, version, @base-ui/react, clsx, eslint, eslint-plugin-react (+18 more)

### Community 23 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 24 - "Miden faucets (testnet airdrop)"
Cohesion: 0.18
Nodes (10): 1. The core idea, 2. Files, 3. Setup, 4. How a user mints, 5. Determinism caveat (verify once), 6. Cross-repo mapping (for swaps, not the dashboard mint), 7. FAQ, Miden faucets (testnet airdrop) (+2 more)

### Community 25 - "AppSidebar.tsx"
Cohesion: 0.16
Nodes (13): mainNav, Sidebar(), SidebarContent(), SidebarGroup(), SidebarGroupContent(), SidebarHeader(), SidebarMenu(), SidebarMenuButton() (+5 more)

### Community 26 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 27 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 28 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 29 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 30 - "Epoch Dashboard"
Cohesion: 0.25
Nodes (7): Deploying, Epoch Dashboard, Features, Scripts, Setup, Stack, Supported chains

### Community 31 - "create-miden-faucets.mjs"
Cohesion: 0.33
Nodes (6): exists(), FILES, IDS, main(), ROOT, SYMBOLS

### Community 32 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 33 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 34 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 35 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 36 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 37 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 38 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 39 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 40 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 41 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 42 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 43 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 44 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 45 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 46 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 47 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 64 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, format, format:check, lint, miden:faucets:create, preview

### Community 65 - "vite.config.ts"
Cohesion: 0.25
Nodes (7): @tailwindcss/vite, vite, vite-plugin-top-level-await, vite-plugin-wasm, @vitejs/plugin-react, __dirname, __filename

## Knowledge Gaps
- **359 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+354 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 433 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `ReclaimMidenSection.tsx` to `DepositsTable.tsx`, `main.tsx`, `useMidenFaucetMint.ts`, `web3.ts`, `sidebar.tsx`, `cn`, `dropdown-menu.tsx`, `sheet.tsx`, `AppLayout.tsx`, `package.json`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `DepositsTable.tsx`, `ReclaimMidenSection.tsx`, `sidebar.tsx`, `dropdown-menu.tsx`, `sheet.tsx`, `AppLayout.tsx`, `AppSidebar.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _359 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DepositsTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06547619047619048 - nodes in this community are weakly interconnected._
- **Should `ReclaimMidenSection.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10116550116550116 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._