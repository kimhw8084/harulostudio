import { expect, test } from "@playwright/test";

const profiles = [
  [1440, 900], [1280, 800], [1100, 800], [1024, 768], [961, 768], [960, 768],
  [900, 1100], [768, 1024], [430, 932], [390, 844], [360, 800], [320, 568], [1280, 640],
] as const;

test("header has only single-row and compact modes across its threshold", async ({ page }) => {
  await page.goto("/");
  for (const [width, height] of profiles) {
    await page.setViewportSize({ width, height });
    const header = page.locator(".site-header");
    const nav = header.locator("nav");
    const menu = page.getByRole("button", { name: /Menu/ });
    const bounds = await header.boundingBox();
    expect(bounds).toBeTruthy();
    if (width > 960) {
      await expect(nav).toBeVisible();
      await expect(menu).toBeHidden();
      const lockup = await header.locator(".wordmark").boundingBox();
      const navBox = await nav.boundingBox();
      expect(lockup && navBox && Math.abs((lockup.y + lockup.height / 2) - (navBox.y + navBox.height / 2))).toBeLessThan(24);
      expect(bounds!.height).toBeLessThan(110);
    } else {
      await expect(nav).toBeHidden();
      await expect(menu).toBeVisible();
      expect(bounds!.height).toBeLessThan(100);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}×${height}`).toBe(true);
  }
});

test("Genesis mobile selector stays usable at 320 and 390", async ({ page }) => {
  await page.goto("/");
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
    await page.locator(".genesis-toggle").click();
    await expect(page.locator(".genesis-stage")).toHaveAttribute("data-phase", "open");
    const tabs = page.locator(".genesis-interface").getByRole("tab");
    await expect(tabs).toHaveCount(5);
    for (const tab of await tabs.all()) {
      const box = await tab.boundingBox();
      expect(box && box.height >= 44 && box.width >= 44).toBeTruthy();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.locator(".genesis-toggle").click();
    await expect(page.locator(".genesis-stage")).toHaveAttribute("data-phase", "resting");
  }
});

test("large text keeps primary tasks reachable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/software/namu", "/software/haru-weather", "/software/dami"]) {
    await page.goto(route);
    await page.evaluate(() => { document.documentElement.style.fontSize = "32px"; });
    if (route === "/") {
      await page.locator(".genesis-toggle").click();
      await expect(page.locator(".genesis-stage")).toHaveAttribute("data-phase", "open");
      await expect(page.locator(".genesis-interface").getByRole("slider", { name: "Music" })).toBeVisible();
    }
    if (route.endsWith("namu")) await expect(page.getByRole("textbox", { name: "Selected note body" })).toBeVisible();
    if (route.endsWith("haru-weather")) await expect(page.getByRole("region", { name: "Hourly weather table" })).toBeVisible();
    if (route.endsWith("dami")) await expect(page.getByRole("spinbutton", { name: "Editable allocation in US dollars" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route).toBe(true);
  }
});
