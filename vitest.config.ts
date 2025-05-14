import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom", // Umożliwia testowanie komponentów React
    exclude: [...configDefaults.exclude, "tests/e2e/**"],
  },
});
