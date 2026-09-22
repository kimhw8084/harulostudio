import { expect, test } from "@playwright/test";

test("Sori X-Ray overlays actual controls without intercepting the specimen", async ({ page }) => {
  await page.goto("/software/sori");
  const xray = page.locator(".software-xray").first();
  const tabs = xray.getByRole("tab");
  await expect(tabs).toHaveCount(4);
  await expect(xray.locator(".xray-overlay")).toHaveCount(0);
  await xray.getByRole("tab", { name: "Keyboard" }).click();
  const keyboard = xray.locator(".xray-overlay");
  await expect(keyboard).toBeVisible();
  await expect(keyboard).toHaveAttribute("aria-hidden", "true");
  await expect(keyboard).toHaveCSS("pointer-events", "none");
  await expect(keyboard).toContainText("Actual focus targets");
  await xray.getByRole("tab", { name: "Accessibility" }).click();
  await expect(xray.locator(".xray-overlay")).toContainText("Actual semantic controls");
  await xray.getByRole("tab", { name: "Data boundary" }).click();
  await expect(xray.locator(".xray-overlay")).toContainText("USER ACTION → LOCAL REDUCER → VISIBLE RESULT");
  await xray.getByRole("tab", { name: "Interface" }).click();
  await expect(xray.locator(".xray-overlay")).toHaveCount(0);
  const slider = xray.getByRole("slider", { name: "Music" });
  await slider.fill("42");
  await expect(slider).toHaveValue("42");
});
