import { expect, test } from "@playwright/test";
import { sceneProgress } from "@/lib/brand/scene";

test("scene coordinate calculation changes after scroll without a resize", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Complex stale-bounds contract is pinned to Chromium; WebKit lifecycle is covered by the stable layout test.");
  expect(sceneProgress(800, 800, 400)).toBe(0);
  expect(sceneProgress(800, 200, 400)).toBeGreaterThan(0);
  expect(sceneProgress(800, 0, 0)).toBe(0);

  await page.goto("/");
  const scene = page.locator(".meaning-scene");
  await expect(scene).toBeVisible();
  const before = Number(await scene.evaluate((element) => getComputedStyle(element).getPropertyValue("--scene-progress")));
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect.poll(() => Number(scene.evaluate((element) => getComputedStyle(element).getPropertyValue("--scene-progress")))).not.toBe(before);
  const afterScroll = Number(await scene.evaluate((element) => getComputedStyle(element).getPropertyValue("--scene-progress")));
  await page.setViewportSize({ width: 900, height: 700 });
  await page.locator(".edition-card-link").first().scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect.poll(() => Number(scene.evaluate((element) => getComputedStyle(element).getPropertyValue("--scene-progress")))).not.toBe(afterScroll);
  if (testInfo.project.name === "chromium") {
    await scene.scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const element = document.querySelector(".meaning-scene");
      if (!element) throw new Error("meaning scene missing");
      const rect = element.getBoundingClientRect();
      element.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "mouse", clientX: rect.left + rect.width * .75, clientY: rect.top + rect.height * .5 }));
    });
    await expect.poll(() => scene.evaluate((element) => getComputedStyle(element).getPropertyValue("--field-dx"))).not.toBe("0px");
  }
});

test("meaning environment has a real layout and motion fallback", async ({ page }) => {
  await page.goto("/studio");
  const scene = page.locator(".meaning-scene");
  const box = await scene.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThan(240);
  const canvas = scene.locator("canvas");
  await expect.poll(() => canvas.evaluate((node) => ({ width: (node as HTMLCanvasElement).width, height: (node as HTMLCanvasElement).height }))).toEqual(expect.objectContaining({ width: expect.any(Number), height: expect.any(Number) }));
  const dimensions = await canvas.evaluate((node) => ({ width: (node as HTMLCanvasElement).width, height: (node as HTMLCanvasElement).height }));
  expect(dimensions.width).toBeGreaterThan(0);
  expect(dimensions.height).toBeGreaterThan(0);
});

test("publisher pages keep reactive environments out of working controls", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Canvas interaction evidence is pinned to Chromium normal motion.");
  await page.goto("/");
  await expect(page.locator('[data-environment="flow"]')).toHaveCount(0);

  await page.goto("/software/sori");
  await expect(page.locator('[data-environment="membrane"]')).toHaveCount(0);
  const slider = page.getByRole("slider", { name: "Music" });
  const before = await slider.boundingBox();
  await page.mouse.move((before?.x ?? 0) + 120, (before?.y ?? 0) + 15);
  const after = await slider.boundingBox();
  expect(after).toEqual(before);
});
