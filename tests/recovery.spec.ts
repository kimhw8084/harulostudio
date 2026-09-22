import { expect, test } from "@playwright/test";

test("unknown routes and missing assets recover with the Harulo 404 and no leaked details", async ({ page }) => {
  const missing = await page.request.get("/this-route-does-not-exist");
  expect(missing.status()).toBe(404);
  await page.goto("/this-route-does-not-exist");
  await expect(page.getByRole("heading", { name: "Nothing published here." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Back to Harulo/ })).toHaveAttribute("href", "/");
  const asset = await page.request.get("/brand/missing.png");
  expect(asset.status()).toBe(404);
});
