import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("accessibility checks @a11y", () => {
for (const path of ["/", "/software", "/studio", "/press", "/privacy", "/software/sori"]) {
  test(`axe smoke: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}

test("expanded Genesis remains accessible", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open example" }).click();
  await expect(page.locator(".genesis-interface")).toHaveAttribute("aria-hidden", "false");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

for (const path of ["/software/namu", "/software/goyo", "/software/haru-weather", "/software/dami"]) {
  test(`axe showcase controls: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}

test("Sori X-Ray layers remain accessible and keyboard navigable", async ({ page }) => {
  await page.goto("/software/sori");
  await page.locator(".xray-inspection summary").click();
  await page.getByRole("tab", { name: "Accessibility" }).click();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  await page.getByRole("tab", { name: "Interface" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Keyboard" })).toBeFocused();
});

test("mobile navigation dialog has focus containment and an Escape path", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: /Menu/ }).click();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: /Menu/ })).toBeFocused();
});

test("dark publisher and product surfaces retain accessible contrast", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Chromium covers the full dark palette; cross-browser semantics run above.");
  await page.emulateMedia({ colorScheme: "dark" });
  for (const path of ["/", "/software", "/studio", "/press", "/privacy", "/software/sori", "/software/namu", "/software/goyo", "/software/haru-weather", "/software/dami"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${path}: ${JSON.stringify(results.violations, null, 2)}`).toEqual([]);
  }
});
});
