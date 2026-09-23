import { expect, test } from "@playwright/test";

test("inspection is secondary and leaves Sori controls usable", async ({ page }) => {
  await page.goto("/software/sori");
  const xray = page.locator(".software-xray");
  const disclosure = xray.locator(".xray-inspection");
  const slider = xray.getByRole("slider", { name: "Music" });
  await expect(disclosure).not.toHaveAttribute("open", "");
  await slider.fill("42");
  await disclosure.locator("summary").click();
  await expect(xray.getByRole("tab")).toHaveCount(4);
  await xray.getByRole("tab", { name: "Keyboard" }).click();
  await expect(xray.locator(".xray-badges span").first()).toBeVisible();
  await expect(xray.locator(".xray-reading")).toContainText("Music");
  await expect(xray.locator(".xray-badges")).toHaveCSS("pointer-events", "none");
  await xray.getByRole("tab", { name: "Accessibility" }).click();
  await expect(xray.locator(".xray-reading")).toContainText("Accessible controls");
  await xray.getByRole("tab", { name: "Data boundary" }).click();
  await expect(xray.locator(".xray-reading")).toContainText("USER ACTION → LOCAL STATE → VISIBLE RESULT");
  await disclosure.locator("summary").click();
  await expect(slider).toHaveValue("42");
});
