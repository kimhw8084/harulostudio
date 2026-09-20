import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", timeout: 45000, fullyParallel: false,
  use: { baseURL: process.env.HARULO_TEST_URL || "http://127.0.0.1:8791", contextOptions: { reducedMotion: "reduce", colorScheme: "light" }, trace: "retain-on-failure" },
  outputDir: "./work/test-results",
  reporter: [["list"], ["json", { outputFile: "work/test-results.json" }]],
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
