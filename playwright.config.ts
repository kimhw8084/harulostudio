import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", timeout: 45000, fullyParallel: false,
  use: { baseURL: process.env.HARULO_TEST_URL || "http://127.0.0.1:8788", colorScheme: "light", trace: "retain-on-failure" },
  webServer: process.env.HARULO_TEST_URL ? undefined : {
    command: "npm run start -- --port 8788",
    url: "http://127.0.0.1:8788",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  outputDir: "./work/test-results",
  reporter: [["list"], ["json", { outputFile: "work/test-results.json" }]],
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], contextOptions: { reducedMotion: "no-preference", colorScheme: "light" } } },
    { name: "chromium-reduced", use: { ...devices["Desktop Chrome"], contextOptions: { reducedMotion: "reduce", colorScheme: "light" } } },
    { name: "webkit", use: { ...devices["Desktop Safari"], contextOptions: { reducedMotion: "no-preference", colorScheme: "light" } } },
  ],
});
