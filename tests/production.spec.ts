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
    await expect(page.getByRole("tabpanel", { name: "Namu" })).toContainText("Namu");
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

  test("final return consumes page-specific anchors", async ({ page }) => {
    const pages = [
      ["/", "home", ["home-return-aperture", "genesis-primary-rail", "genesis-secondary-rail", "home-return-signal"]],
      ["/software", "software", ["software-return-aperture", "software-return-primary", "software-return-secondary", "software-return-signal"]],
      ["/studio", "studio", ["studio-return-aperture", "studio-return-primary", "studio-return-secondary", "studio-return-signal"]],
      ["/press", "press", ["press-return-aperture", "press-return-primary", "press-return-secondary", "press-return-signal"]],
      ["/privacy", "privacy", ["privacy-return-aperture", "privacy-return-primary", "privacy-return-secondary", "privacy-return-signal"]],
      ["/software/sori", "product-detail", ["product-detail-return-aperture", "product-detail-return-primary", "product-detail-return-secondary", "product-detail-return-signal"]],
    ] as const;
    for (const [path, pageId, anchorIds] of pages) {
      await page.goto(path);
      for (const id of anchorIds) await expect(page.locator(`#${id}`)).toHaveCount(1);
      const footer = page.locator("#footer-return-stage");
      await expect(footer).toHaveAttribute("data-page", pageId);
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toHaveAttribute("data-anchors-measured", "true");
    }
  });
});
