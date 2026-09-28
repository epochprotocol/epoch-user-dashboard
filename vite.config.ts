import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  // wasm + topLevelAwait are required by @miden-sdk/miden-sdk (WASM module).
  plugins: [react(), tailwindcss(), wasm(), topLevelAwait()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // The intents SDK has its own nested commons SDK. Use the dashboard's linked
    // copy so its chain graph stays in sync with the dependency declared here.
    dedupe: ["@epoch-protocol/epoch-commons-sdk"],
  },
  worker: {
    plugins: () => [wasm(), topLevelAwait()],
    format: "es",
  },
  optimizeDeps: {
    // The Miden WASM client must not be pre-bundled by esbuild.
    exclude: ["@miden-sdk/miden-sdk"],
  },
  build: {
    target: "esnext",
  },
  server: {
    port: 3001,
    strictPort: false,
  },
});
