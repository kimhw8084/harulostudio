import { expect, test } from "@playwright/test";

test.describe("reviewed visual checkpoints", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Baselines are pinned to Chromium normal motion.");
  });
  const pages = [
    ["home-light-desktop", "/", "light"], ["home-dark-desktop", "/", "dark"],
    ["software", "/software", "light"], ["studio", "/studio", "light"],
    ["press", "/press", "light"], ["privacy", "/privacy", "light"],
    ["404", "/visual-route-missing", "light"], ["sori", "/software/sori", "light"],
    ["namu", "/software/namu", "light"], ["goyo", "/software/goyo", "light"],
    ["haru-weather", "/software/haru-weather", "light"], ["dami", "/software/dami", "light"],
  ] as const;
  for (const [name, path, scheme] of pages) {
    test(name, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true, animations: "disabled" });
    });
  }
  test("home mobile light", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/");
    await expect(page).toHaveScreenshot("home-light-mobile.png", { fullPage: true, animations: "disabled" });
  });
  test("home mobile dark", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); await page.emulateMedia({ colorScheme: "dark" }); await page.goto("/");
    await expect(page).toHaveScreenshot("home-dark-mobile.png", { fullPage: true, animations: "disabled" });
  });
  test("genesis rest and open", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator(".genesis-toggle");
    await toggle.scrollIntoViewIfNeeded();
    await expect(page.locator(".genesis-stage")).toHaveAttribute("data-phase", "resting");
    await expect(page).toHaveScreenshot("home-genesis-rest.png", { fullPage: false, animations: "disabled" });
    await toggle.click(); await expect(page.locator(".genesis-stage")).toHaveAttribute("data-phase", "open");
    await expect(page.locator(".genesis-interface")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
    await expect(page).toHaveScreenshot("home-genesis-open.png", { fullPage: false, animations: "disabled" });
  });
  test("Sori X-Ray layers", async ({ page }) => {
    await page.goto("/software/sori");
    await page.locator(".motion-button").evaluate((element) => (element as HTMLButtonElement).click());
    await expect(page.locator(".motion-button")).toContainText("Resume motion");
    for (const layer of ["Keyboard", "Accessibility"]) { await page.getByRole("tab", { name: layer }).click(); await expect(page).toHaveScreenshot(`sori-xray-${layer.toLowerCase()}.png`, { fullPage: true, animations: "disabled" }); }
  });
  test("final return start and end", async ({ page }) => {
    await page.goto("/"); const footer = page.locator("#footer-return-stage"); await expect(footer).toBeVisible();
    await expect(page).toHaveScreenshot("final-return-start.png", { fullPage: false, animations: "disabled" });
    await footer.scrollIntoViewIfNeeded(); await expect(footer).toHaveAttribute("data-complete", "true", { timeout: 5000 });
    await expect(page).toHaveScreenshot("final-return-end.png", { fullPage: false, animations: "disabled" });
  });
});
