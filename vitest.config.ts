import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    // Disable PostCSS processing in tests — we only test TS/JS logic
    postcss: {
      plugins: [],
    },
  },
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/app/lib/**", "src/app/api/**/route.ts"],
      exclude: ["src/app/lib/__mocks__/**"],
    },
  },
});
