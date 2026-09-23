import { expect, test } from "@playwright/test";

const noPageOverflow = async (page: import("@playwright/test").Page) => {
  await expect(page.locator(".theme-button")).toBeEnabled();
  const result = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(result.page).toBeLessThanOrEqual(result.viewport + 1);
};

test("desktop, tablet, short, and holdout profiles preserve page width", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Viewport matrix is captured in Chromium; functional navigation also runs in WebKit.");
  for (const [width, height] of [[1440, 900], [1280, 800], [1024, 768], [900, 1100], [768, 1024], [1280, 640], [1024, 640], [1366, 768]]) {
    await page.setViewportSize({ width, height });
    for (const route of ["/", "/software", "/studio"]) {
      await page.goto(route);
      await noPageOverflow(page);
      const header = page.locator(".site-header");
      expect(await header.evaluate((node) => node.getBoundingClientRect().height)).toBeLessThan(110);
    }
  }
});

test("small and holdout phones keep the five concepts reachable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Viewport matrix is captured in Chromium; functional controls also run in WebKit.");
  for (const [width, height] of [[430, 932], [390, 844], [360, 800], [320, 568], [412, 915]]) {
    await page.setViewportSize({ width, height });
    for (const route of ["/", "/software", "/software/sori", "/software/namu", "/software/goyo", "/software/haru-weather", "/software/dami"]) {
      await page.goto(route);
      await noPageOverflow(page);
    }
  }
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/software/sori");
  for (const control of [page.getByRole("slider", { name: "Music" }), page.getByRole("button", { name: "Mute Music" })]) {
    const box = await control.boundingBox();
    expect(box && box.width >= 44 && box.height >= 44 && box.x >= 0 && box.x + box.width <= 321).toBeTruthy();
  }
  await page.goto("/software/goyo");
  await expect(page.getByRole("button", { name: "Start session" })).toBeVisible();
  await page.goto("/software/dami");
  await expect(page.getByText("Remaining", { exact: true })).toBeVisible();
});

test("Genesis and inspection let the page own vertical scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".genesis-toggle").click();
  await expect(page.locator(".genesis-stage")).toHaveAttribute("data-phase", "open");
  const nested = await page.locator(".genesis-stage").evaluate((root) => Array.from(root.querySelectorAll("*")).filter((node) => {
    const style = getComputedStyle(node);
    return ["auto", "scroll"].includes(style.overflowY) && node.scrollHeight > node.clientHeight + 1;
  }).map((node) => node.className));
  expect(nested).toEqual([]);
  await noPageOverflow(page);
  await page.goto("/software/sori");
  await page.locator(".xray-inspection summary").click();
  await noPageOverflow(page);
});

test("Genesis keeps every concept selector visible and touch sized on small phones", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Small-phone selector geometry is checked in Chromium.");
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.locator(".genesis-toggle").click();
    await expect(page.locator(".genesis-stage")).toHaveAttribute("data-phase", "open");
    const list = page.locator('.genesis-interface [role="tablist"]');
    const listBox = await list.boundingBox();
    expect(listBox).not.toBeNull();
    const tabs = list.getByRole("tab");
    await expect(tabs).toHaveCount(5);
    for (let index = 0; index < 5; index += 1) {
      const tab = tabs.nth(index);
      const box = await tab.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.x).toBeGreaterThanOrEqual(listBox!.x - 1);
      expect(box!.x + box!.width).toBeLessThanOrEqual(listBox!.x + listBox!.width + 1);
      expect(box!.y + box!.height).toBeLessThanOrEqual(listBox!.y + listBox!.height + 1);
    }
    await noPageOverflow(page);
  }
});

test("larger text and forced colors retain access to primary controls", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Browser-specific reflow and forced-colors geometry is checked in Chromium.");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await noPageOverflow(page);
  await expect(page.getByRole("link", { name: /Explore software/ })).toBeVisible();
  await page.evaluate(() => { document.documentElement.style.fontSize = ""; });
  await page.emulateMedia({ forcedColors: "active" });
  await expect(page.locator(".genesis-toggle")).toBeVisible();
  await page.locator(".genesis-toggle").focus();
  const outline = await page.locator(".genesis-toggle").evaluate((node) => getComputedStyle(node).outlineStyle);
  expect(outline).not.toBe("none");
});
