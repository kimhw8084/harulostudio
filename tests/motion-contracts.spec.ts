import { expect, test } from "@playwright/test";

test.describe("motion and geometry contracts", () => {
  test("Genesis completes, switches, reverses, and keeps controls reachable", async ({ page }) => {
    await page.goto("/");
    const stage = page.locator(".genesis-stage");
    const trigger = page.locator(".genesis-toggle");
    const panel = page.locator(".genesis-interface");
    await expect(trigger).toBeEnabled();
    await expect(panel).toHaveAttribute("aria-hidden", "true");
    await trigger.click();
    await expect(stage).toHaveAttribute("data-phase", "open");
    await expect(panel).toHaveAttribute("aria-hidden", "false");
    const markBounds = await stage.evaluate((element) => {
      const outer = element.getBoundingClientRect();
      const mark = element.querySelector(".genesis-mark")?.getBoundingClientRect();
      return mark && { left: mark.left - outer.left, right: outer.right - mark.right, top: mark.top - outer.top, bottom: outer.bottom - mark.bottom };
    });
    expect(markBounds && Object.values(markBounds).every((distance) => distance >= -1)).toBeTruthy();
    await panel.getByRole("tab", { name: "Namu" }).click();
    await panel.getByRole("tab", { name: "Dami" }).click();
    await expect(stage).toHaveAttribute("data-product", "dami");
    await expect(stage).toHaveAttribute("data-phase", "open");
    await page.keyboard.press("Escape");
    await expect(stage).toHaveAttribute("data-phase", "resting");
    await expect(panel).toHaveAttribute("aria-hidden", "true");
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(stage).toHaveAttribute("data-phase", "open");
    const slider = panel.getByRole("slider", { name: "Music" });
    await panel.getByRole("tab", { name: "Sori" }).click();
    await slider.fill("37");
    await page.getByRole("button", { name: /Switch to dark mode/ }).click();
    await expect(slider).toHaveValue("37");
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(stage).toHaveAttribute("data-product", "sori");
    await expect(slider).toHaveValue("37");
    await stage.scrollIntoViewIfNeeded();
    await expect(slider).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });

  test("Genesis interruption follows the latest request", async ({ page }) => {
    await page.goto("/");
    const trigger = page.locator(".genesis-toggle");
    const stage = page.locator(".genesis-stage");
    await expect(trigger).toBeEnabled();
    await trigger.click();
    await trigger.click();
    await expect(stage).toHaveAttribute("data-phase", "resting");
    await trigger.click();
    await expect(stage).toHaveAttribute("data-phase", "open");
    await trigger.click();
    await trigger.click();
    await expect(stage).toHaveAttribute("data-phase", "open");
  });

  test("native navigation and compact mobile dialog recover cleanly", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const menu = page.getByRole("button", { name: /Menu/ });
    await menu.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(menu).toBeFocused();
    await menu.click();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("link", { name: "Software" }).first().click();
    await expect(page).toHaveURL(/\/software\/?$/);
    await page.getByRole("link", { name: "Explore Sori" }).click();
    await expect(page).toHaveURL(/\/software\/sori\/?$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/software\/?$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/software\/sori\/?$/);
  });

  test("final return is finite, local, and absent from utility pages", async ({ page }, testInfo) => {
    if (testInfo.project.name !== "chromium-reduced") {
      await page.addInitScript(() => { (window as Window & { __HARULO_TEST_HOLD_RETURN__?: boolean }).__HARULO_TEST_HOLD_RETURN__ = true; });
    }
    await page.goto("/");
    const signature = page.locator(".home-final-return");
    await signature.scrollIntoViewIfNeeded();
    if (testInfo.project.name !== "chromium-reduced") {
      await expect(signature).toHaveAttribute("data-progress", "0.000");
      await expect(signature.locator('[data-harulo-pieces="4"]')).toHaveAttribute("data-resting", "false");
      await page.evaluate(() => window.dispatchEvent(new Event("harulo:test-return-release")));
    }
    await expect(signature).toHaveAttribute("data-complete", "true");
    await expect(signature.locator('[data-harulo-pieces="4"]')).toHaveAttribute("data-resting", "true");
    const mark = await signature.locator(".harulo-mark").boundingBox();
    const section = await signature.boundingBox();
    expect(mark && section && mark.width <= section.width && mark.height <= section.height).toBeTruthy();
    if (testInfo.project.name === "chromium-reduced") await expect(signature).toHaveAttribute("data-complete", "true");
    await expect(page.getByRole("button", { name: /Replay return|Pause motion/i })).toHaveCount(0);
    for (const path of ["/press", "/privacy", "/software/sori", "/missing-page"]) {
      await page.goto(path);
      await expect(page.locator(".home-final-return")).toHaveCount(0);
    }
  });

  test("404 footer decoration stays bounded and leaves the route action visible", async ({ page }) => {
    await page.goto("/missing-page");
    const footer = page.locator(".compact-footer");
    const action = page.getByRole("link", { name: /Back to Harulo/ });
    await expect(action).toBeVisible();
    const footerBox = await footer.boundingBox();
    const actionBox = await action.boundingBox();
    const marks = await footer.locator("svg").evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().toJSON()));
    expect(footerBox && actionBox).toBeTruthy();
    for (const mark of marks) {
      expect(mark.width).toBeLessThan(120);
      expect(mark.height).toBeLessThan(120);
      expect(mark.top).toBeGreaterThanOrEqual((footerBox?.y ?? 0) - 1);
      expect(mark.bottom).toBeLessThanOrEqual((footerBox?.y ?? 0) + (footerBox?.height ?? 0) + 1);
      expect(mark.top >= (actionBox?.y ?? 0) + (actionBox?.height ?? 0) || mark.bottom <= (actionBox?.y ?? 0)).toBe(true);
    }
  });
});
