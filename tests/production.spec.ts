import { expect, test } from "@playwright/test";

test.describe("public Harulo production surface", () => {
  test("homepage is immediately clear and genesis starts resting", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Independent software publisher").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Software that gives a little of the day back." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "One mark. One working idea." })).toBeVisible();
    await expect(page.getByText("Interactive concept — not released software.").first()).toBeVisible();
    const trigger = page.getByRole("button", { name: "Open example" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("tab", { name: "Sori" })).toBeHidden();
    await expect(page.getByRole("link", { name: "Press" }).first()).toBeVisible();
  });

  test("genesis opens with real tabs and closes with focus return", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Open example" });
    await trigger.click();
    await expect(page.getByRole("tab", { name: "Sori" })).toBeVisible();
    const close = page.getByRole("button", { name: "Close example" });
    await expect(close).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("tab", { name: "Namu" }).click();
    await expect(page.getByRole("tabpanel", { name: "Namu" })).toContainText("Selected note");
    await page.getByRole("tab", { name: "Namu" }).focus();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open example" })).toBeFocused();
    await expect(page.getByRole("tab", { name: "Sori" })).toBeHidden();
  });

  test("software catalog contains exactly five clearly separated showcase publications", async ({ page }) => {
    await page.goto("/software");
    await expect(page.getByRole("heading", { name: "Different software. Same direction." }).first()).toBeVisible();
    await expect(page.getByText("Interactive concept — not released software.").first()).toBeVisible();
    for (const name of ["Sori", "Namu", "Goyo", "Haru Weather", "Dami"]) {
      await expect(page.getByRole("heading", { name: new RegExp(`^${name}`) })).toBeVisible();
    }
    await expect(page.getByText("Published editions.")).toHaveCount(0);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
  });

  test("conditional navigation does not advertise unavailable archives", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Releases" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Support" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Archive" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "History" })).toHaveCount(0);
    await expect((await page.request.get("/releases")).status()).toBe(404);
    await expect((await page.request.get("/support")).status()).toBe(404);
  });

  test("theme control exposes an unambiguous action", async ({ page }) => {
    await page.goto("/");
    const theme = page.getByRole("button", { name: /Switch to (dark|light) mode/ });
    await expect(theme).toBeVisible();
    const first = await theme.getAttribute("aria-label");
    await theme.click();
    await expect(theme).not.toHaveAttribute("aria-label", first ?? "");
  });

  test("final return is bounded and home-only", async ({ page }) => {
    await page.goto("/");
    const signature = page.locator(".home-final-return");
    await expect(signature).toHaveCount(1);
    await signature.scrollIntoViewIfNeeded();
    await expect(signature).toHaveAttribute("data-complete", "true");
    for (const path of ["/software", "/studio", "/press", "/privacy", "/software/sori", "/not-found"]) {
      await page.goto(path);
      await expect(page.locator(".home-final-return")).toHaveCount(0);
      await expect(page.locator(".compact-footer")).toBeVisible();
    }
  });
});
