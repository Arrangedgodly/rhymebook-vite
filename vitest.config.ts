import { defineConfig } from "vitest/config";

// Separate from vite.config.ts: the tests here are all pure-function unit
// tests (no DOM), so this stays minimal rather than pulling in the app's
// React/Tailwind plugins.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
