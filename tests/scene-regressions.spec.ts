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
  await page.locator(".edition-disclosure summary").first().click();
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

test("flow and membrane environments wake only from semantic interaction", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Canvas interaction evidence is pinned to Chromium normal motion.");
  await page.goto("/");
  const flow = page.locator('[data-environment="flow"]');
  await expect.poll(() => flow.locator("canvas").evaluate((node) => (node as HTMLCanvasElement).width)).toBeGreaterThan(0);
  const flowScene = page.locator(".hero-scene");
  await flowScene.scrollIntoViewIfNeeded();
  await flowScene.dispatchEvent("pointermove", { pointerType: "mouse", clientX: 300, clientY: 200 });
  await expect.poll(() => flowScene.evaluate((element) => getComputedStyle(element).getPropertyValue("--field-dx"))).not.toBe("0px");

  await page.goto("/software/sori");
  const membrane = page.locator('[data-environment="membrane"]');
  await expect.poll(() => membrane.locator("canvas").evaluate((node) => (node as HTMLCanvasElement).width)).toBeGreaterThan(0);
  const membraneScene = membrane.locator("xpath=ancestor::div[contains(@class,'brand-scene')]");
  await membraneScene.scrollIntoViewIfNeeded();
  await membraneScene.dispatchEvent("pointermove", { pointerType: "mouse", clientX: 500, clientY: 280 });
  await expect.poll(() => membraneScene.evaluate((element) => element.dataset.active)).toBe("true");
});
