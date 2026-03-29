import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@thabeut/react-data-kit": path.resolve(dir, "../src/index.ts"),
    },
  },
  server: {
    port: 5173,
  },
});
