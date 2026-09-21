import { expect, test } from "@playwright/test";

test.describe("public Harulo production surface", () => {
  test("homepage explains the publisher and exposes the showcase", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Independent software publisher").first()).toBeVisible();
    await expect(page.getByText("SHOWCASE ONLY · NOTHING SAVED OR SENT")).toBeVisible();
    await expect(page.getByRole("tab", { name: /Sori/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Press" }).first()).toBeVisible();
  });

  test("all five showcase publications are visible and clearly labelled", async ({ page }) => {
    await page.goto("/software");
    await expect(page.getByText("Five interactive concepts", { exact: false })).toBeVisible();
    for (const name of ["Sori", "Namu", "Goyo", "Haru Weather", "Dami"]) {
      await expect(page.getByRole("heading", { name: new RegExp(`^${name}`) })).toBeVisible();
    }
    await expect(page.getByText("NOT CURRENTLY AVAILABLE").first()).toBeVisible();
  });

  test("showcase controls remain local and functional", async ({ page }) => {
    await page.goto("/software/namu");
    const editor = page.getByRole("textbox", { name: "Try a Namu note" });
    await editor.fill("A note for today.");
    await page.getByRole("button", { name: "Add note" }).click();
    await expect(page.getByText("A note for today.")).toBeVisible();
    await expect(page.getByText("Showcase publication").first()).toBeVisible();
  });

  test("truthful navigation has no empty release or support destinations", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Releases" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Support" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Archive" })).toHaveCount(0);
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: "A clear account of this website." })).toBeVisible();
  });
});
