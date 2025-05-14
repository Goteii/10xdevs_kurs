import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

export default defineConfig({
  testDir: "./tests/e2e", // Katalog z testami e2e
  timeout: 30000,
  use: {
    headless: true, // Uruchamiaj testy w trybie headless
    actionTimeout: 0,
    trace: "on-first-retry", // Śledzenie dla pierwszej próby
  },
});
