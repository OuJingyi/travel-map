import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const isProdEnv = process.env.NODE_ENV === 'production';
const PUBLIC_PATH = isProdEnv ? '/travel-map/' : '/';
const OUT_DIR = 'dist';
const PLUGINS = [react()];

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8080,
    hmr: {
      overlay: true,
      protocol: 'ws',
      host: 'localhost'
    },
    watch: {
      usePolling: true,
      interval: 100
    },
    cors: true,
    strictPort: true
  },
  plugins: PLUGINS,
  base: PUBLIC_PATH,
  build: {
    outDir: OUT_DIR
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "lib",
        replacement: resolve(__dirname, "lib"),
      },
    ],
  },
});
