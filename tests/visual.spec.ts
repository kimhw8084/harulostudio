import { test, expect } from "@playwright/test";

// Opt in for the pinned Chromium renderer. Baselines are review artifacts, never site media.
test("stable Cobalt Ember visual checkpoints", async ({ page }, info) => {
  test.skip(
    process.env.HARULO_VISUAL !== "1" ||
      process.env.HARULO_TEST_MODE !== "development" ||
      info.project.name !== "chromium",
    "Opt-in development visual regression.",
  );
  test.setTimeout(90000);
  const checkpoints = [
    ["home-light", "/", 1440, "light", ""],
    ["home-dark", "/", 1440, "dark", ""],
    ["mobile-light", "/", 390, "light", ""],
    ["mobile-dark", "/", 390, "dark", ""],
    ["product", "/preview/2036/software/sori", 1440, "light", ""],
    [
      "product-instrument",
      "/preview/2036/software/sori",
      1440,
      "light",
      ".product-detail-art",
    ],
    ["releases", "/preview/2036/releases?product=sori", 1440, "light", ""],
    ["archive", "/preview/2036/archive", 1440, "dark", ""],
    ["support", "/preview/2036/support/namu/export", 1440, "light", ""],
    ["history-reduced", "/preview/2036/history", 1440, "light", ".chrono-lens"],
    [
      "release-river-reduced",
      "/preview/2036/releases?product=sori",
      1440,
      "dark",
      ".release-river",
    ],
  ] as const;
  for (const [name, path, width, colorScheme, selector] of checkpoints) {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("data-enhanced", "true");
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      colorScheme,
    );
    await page.evaluate(() => document.fonts.ready);
    if (selector)
      await expect(page.locator(selector)).toHaveScreenshot(`${name}.png`, {
        animations: "disabled",
        maxDiffPixelRatio: 0.005,
      });
    else
      await expect(page).toHaveScreenshot(`${name}.png`, {
        animations: "disabled",
        maxDiffPixelRatio: 0.005,
      });
  }
});
