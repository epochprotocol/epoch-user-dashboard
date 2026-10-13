# Graph Report - epoch-dashboard  (2026-10-10)

## Corpus Check
- 127 files · ~64,403 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 791 nodes · 1398 edges · 66 communities (44 shown, 20 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7852cc2a`
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
- What You Must Do When Invoked
- tsconfig.json
- rpc.ts
- package.json
- vercel.json
- What You Must Do When Invoked
- Miden faucets (testnet airdrop)
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
- tooltip.tsx
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
- SidebarProvider
- AGENTS.md
- CLAUDE.md
- .claude/CLAUDE.md
- .claude/skills/graphify/references/extraction-spec.md
- .codex/skills/graphify/references/extraction-spec.md
- MIDEN_TESTNET_MIGRATION.md
- .opencode/skills/graphify/references/extraction-spec.md
- agent/skills/graphify/references/extraction-spec.md

## God Nodes (most connected - your core abstractions)
1. `cn()` - 110 edges
2. `react` - 38 edges
3. `compilerOptions` - 25 edges
4. `lucide-react` - 22 edges
5. `Button()` - 19 edges
6. `wagmi` - 14 edges
7. `useNotification()` - 13 edges
8. `@miden-sdk/miden-sdk` - 12 edges
9. `useMidenFaucetMint()` - 12 edges
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

## Communities (66 total, 20 thin omitted)

### Community 0 - "DepositsTable.tsx"
Cohesion: 0.07
Nodes (46): @epoch-protocol/epoch-intents-sdk, CancelWithdrawalDialog(), CancelWithdrawalDialogProps, Countdown(), CountdownProps, formatRemaining(), DepositsTable(), DialogState (+38 more)

### Community 1 - "ReclaimMidenSection.tsx"
Cohesion: 0.10
Nodes (48): class-variance-authority, lucide-react, react, EvmFaucetCard(), PRESET_AMOUNTS, MidenFaucetCard(), PRESET_AMOUNTS, MidenFaucetSection() (+40 more)

### Community 2 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @base-ui/react, class-variance-authority, clsx, @epoch-protocol/epoch-intents-sdk, @fontsource-variable/geist, lucide-react, @miden-sdk/miden-sdk (+17 more)

### Community 3 - "main.tsx"
Cohesion: 0.06
Nodes (36): @rainbow-me/rainbowkit, react-router-dom, sonner, @tanstack/react-query, wagmi, AppLayout(), PAGE_TITLES, AppSidebar() (+28 more)

### Community 4 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, eslint, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, prettier, @types/node (+9 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (27): compilerOptions, allowImportingTsExtensions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx (+19 more)

### Community 6 - "useMidenFaucetMint.ts"
Cohesion: 0.07
Nodes (44): @miden-sdk/miden-sdk, @miden-sdk/miden-wallet-adapter-react, MidenFaucetCardProps, base64ToBytes(), bytesToBase64(), hasAllFaucetFiles(), MIDEN_FAUCET_FILES, MIDEN_FAUCET_DECIMALS (+36 more)

### Community 7 - "web3.ts"
Cohesion: 0.08
Nodes (24): @miden-sdk/miden-wallet-adapter-base, viem, EvmFaucetCardProps, ReclaimByIdCard(), ChainInfo, EpochGraph, getChainNameByChainId(), getGraphForChain() (+16 more)

### Community 8 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 9 - "sidebar.tsx"
Cohesion: 0.10
Nodes (27): mainNav, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+19 more)

### Community 10 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 11 - "cn"
Cohesion: 0.20
Nodes (14): AlertAction(), CardAction(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton() (+6 more)

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

### Community 16 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 17 - "tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, files, references

### Community 19 - "package.json"
Cohesion: 0.05
Nodes (41): name, private, scripts, build, dev, format, format:check, lint (+33 more)

### Community 23 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 24 - "Miden faucets (testnet airdrop)"
Cohesion: 0.18
Nodes (10): 1. The core idea, 2. Files, 3. Setup, 4. How a user mints, 5. Determinism caveat (verify once), 6. Cross-repo mapping (for swaps, not the dashboard mint), 7. FAQ, Miden faucets (testnet airdrop) (+2 more)

### Community 25 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 26 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 27 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 28 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 29 - "Epoch Dashboard"
Cohesion: 0.25
Nodes (7): Deploying, Epoch Dashboard, Features, Scripts, Setup, Stack, Supported chains

### Community 30 - "create-miden-faucets.mjs"
Cohesion: 0.33
Nodes (6): exists(), FILES, IDS, main(), ROOT, SYMBOLS

### Community 31 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 32 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 33 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 34 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 35 - "tooltip.tsx"
Cohesion: 0.40
Nodes (3): Tooltip(), TooltipContent(), TooltipTrigger()

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

## Knowledge Gaps
- **361 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+356 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 437 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `ReclaimMidenSection.tsx` to `DepositsTable.tsx`, `main.tsx`, `useMidenFaucetMint.ts`, `web3.ts`, `sidebar.tsx`, `cn`, `dropdown-menu.tsx`, `sheet.tsx`, `package.json`, `SidebarProvider`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `DepositsTable.tsx`, `ReclaimMidenSection.tsx`, `tooltip.tsx`, `sidebar.tsx`, `dropdown-menu.tsx`, `sheet.tsx`, `SidebarProvider`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _361 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DepositsTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06502816180235535 - nodes in this community are weakly interconnected._
- **Should `ReclaimMidenSection.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09920983318700614 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._