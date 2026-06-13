// BUXE_OS v24.X -- VITEST_CONFIG

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom" },
  resolve: { alias: { "@": path.resolve(__dirname, "./") } },
});
