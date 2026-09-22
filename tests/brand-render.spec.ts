import { expect, test } from "@playwright/test";

test("rendered resting mark exposes the canonical geometry", async ({ page }) => {
  await page.goto("/");
  const mark = page.locator('svg.harulo-mark').first();
  await expect(mark.locator('[data-piece="ring"]')).toHaveAttribute("cx", "47.5");
  await expect(mark.locator('[data-piece="ring"]')).toHaveAttribute("cy", "41.5");
  await expect(mark.locator('[data-piece="ring"]')).toHaveAttribute("r", "18.25");
  await expect(mark.locator('[data-piece="ring"]')).toHaveAttribute("stroke-width", "7.25");
  await expect(mark.locator('[data-piece="satellite"]')).toHaveAttribute("cx", "68.9");
  await expect(mark.locator('[data-piece="satellite"]')).toHaveAttribute("cy", "29.2");
  for (const [piece, attributes] of [["primary-tier", { x: "30", y: "58.5", width: "40", height: "6.8", rx: "3.4" }], ["secondary-tier", { x: "39.2", y: "67.6", width: "21.6", height: "5.5", rx: "2.75" }]] as const) {
    for (const [name, value] of Object.entries(attributes)) await expect(mark.locator(`[data-piece="${piece}"]`)).toHaveAttribute(name, value);
  }
  await expect(mark.locator('[data-piece="satellite"]')).toHaveCSS("fill", "rgb(255, 92, 53)");
  await expect(mark.locator('[data-piece="ring"]')).toHaveCSS("stroke", "rgb(18, 61, 255)");
});
