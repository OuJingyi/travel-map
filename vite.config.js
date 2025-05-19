import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

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
  plugins: [react()],
  base: '/travel-map/',
  build: {
    outDir: 'dist',
    sourcemap: true
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
