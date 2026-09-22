import { expect, test } from "@playwright/test";

test.describe("deterministic visual evidence", () => {
  for (const [name, path] of [["home-light", "/"], ["home-dark", "/"], ["software", "/software"], ["studio", "/studio"], ["privacy", "/privacy"], ["sori", "/software/sori"]] as const) {
    test(name, async ({ page }) => {
      if (name === "home-dark") await page.emulateMedia({ colorScheme: "dark" });
      await page.goto(path);
      await page.screenshot({ path: `work/visual-${name}.png`, fullPage: true });
      const image = await page.screenshot();
      expect(image.byteLength).toBeGreaterThan(10_000);
    });
  }
});
