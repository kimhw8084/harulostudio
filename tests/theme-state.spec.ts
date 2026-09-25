import { expect, test, type Page } from "@playwright/test";

async function changeThemeWithoutMovingPage(page: Page) {
  const toggle = page.getByRole("button", { name: "Switch to dark mode" });
  await toggle.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => scrollY);
  await toggle.focus();
  await toggle.press("Space");
  await expect(page.locator(".theme-button")).toBeFocused();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(Math.abs((await page.evaluate(() => scrollY)) - before)).toBeLessThan(2);
}

test("theme preserves open Genesis, selected concept, and edited values", async ({ page }) => {
  await page.goto("/");
  await page.locator(".genesis-toggle").click();
  await expect(page.locator(".genesis-stage")).toHaveAttribute("data-phase", "open");
  await page.getByRole("tab", { name: "Sori" }).click();
  await page.locator(".genesis-interface").getByRole("slider", { name: "Music" }).fill("31");
  await changeThemeWithoutMovingPage(page);
  await expect(page.locator(".genesis-stage")).toHaveAttribute("data-phase", "open");
  await expect(page.locator(".genesis-interface").getByRole("slider", { name: "Music" })).toHaveValue("31");
  await page.getByRole("tab", { name: "Namu" }).click();
  await page.getByRole("textbox", { name: "Selected note body" }).fill("A quiet draft");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator(".genesis-stage")).toHaveAttribute("data-product", "namu");
  await expect(page.getByRole("textbox", { name: "Selected note body" })).toHaveValue("A quiet draft");
});

for (const [slug, mutate, verify] of [
  ["sori", async (page: Page) => { await page.getByRole("slider", { name: "Music" }).fill("27"); }, async (page: Page) => { await expect(page.getByRole("slider", { name: "Music" })).toHaveValue("27"); }],
  ["namu", async (page: Page) => { await page.getByRole("textbox", { name: "Selected note body" }).fill("Kept across theme"); }, async (page: Page) => { await expect(page.getByRole("textbox", { name: "Selected note body" })).toHaveValue("Kept across theme"); }],
  ["goyo", async (page: Page) => { await page.getByRole("textbox", { name: "Today’s intention" }).fill("Read one page"); await page.getByRole("button", { name: "Start session" }).click(); }, async (page: Page) => { await expect(page.getByRole("textbox", { name: "Today’s intention" })).toHaveValue("Read one page"); await expect(page.locator(".focus-state")).toContainText("in progress"); }],
  ["haru-weather", async (page: Page) => { await page.getByRole("button", { name: "Evening" }).click(); }, async (page: Page) => { await expect(page.getByRole("button", { name: "Evening" })).toHaveAttribute("aria-pressed", "true"); await expect(page.getByRole("table")).toContainText("61%"); }],
  ["dami", async (page: Page) => { await page.getByRole("spinbutton", { name: "Editable allocation in US dollars" }).fill("450"); }, async (page: Page) => { await expect(page.getByRole("spinbutton", { name: "Editable allocation in US dollars" })).toHaveValue("450"); }],
] as const) {
  test(`theme preserves ${slug} specimen state`, async ({ page }) => {
    await page.goto(`/software/${slug}`);
    await mutate(page);
    await changeThemeWithoutMovingPage(page);
    await verify(page);
  });
}
