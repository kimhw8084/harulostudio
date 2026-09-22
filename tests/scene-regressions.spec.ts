import { expect, test } from "@playwright/test";
import { sceneProgress } from "@/lib/brand/scene";

test("scene coordinate calculation changes after scroll without a resize", async ({ page }) => {
  expect(sceneProgress(800, 800, 400)).toBe(0);
  expect(sceneProgress(800, 200, 400)).toBeGreaterThan(0);
  expect(sceneProgress(800, 0, 0)).toBe(0);

  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 900));
  const scene = page.locator(".meaning-scene");
  await expect(scene).toBeVisible();
  await expect.poll(() => scene.evaluate((element) => getComputedStyle(element).getPropertyValue("--scene-progress"))).toMatch(/[0-9.]+/);
  const progress = await scene.evaluate((element) => getComputedStyle(element).getPropertyValue("--scene-progress"));
  expect(progress).not.toBe("");
});
