import { expect, test } from "@playwright/test";

type Sample = { time: number; phase: string; progress: number; scrollY: number; stageTop: number; stageHeight: number; belowTop: number };

async function sampleTransition(page: import("@playwright/test").Page) {
  return page.evaluate(async () => {
    const stage = document.querySelector<HTMLElement>(".genesis-stage")!;
    const below = document.querySelector<HTMLElement>(".genesis-controls")!;
    const trigger = document.querySelector<HTMLButtonElement>(".genesis-toggle")!;
    const samples: Sample[] = [];
    const read = () => {
      const stageBox = stage.getBoundingClientRect();
      samples.push({ time: performance.now(), phase: stage.dataset.phase || "", progress: Number(stage.dataset.progress), scrollY, stageTop: stageBox.top, stageHeight: stageBox.height, belowTop: below.getBoundingClientRect().top });
    };
    read();
    trigger.click();
    await new Promise<void>((resolve) => {
      const tick = () => {
        read();
        if (samples.length > 90 || stage.dataset.phase === (samples[0].phase === "resting" ? "open" : "resting")) resolve();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    return samples;
  });
}

for (const [width, height] of [[1280, 800], [390, 844]]) {
  test(`Genesis layout follows motion without teleporting at ${width}px`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "chromium-reduced", "The animated geometry oracle applies to normal motion; reduced motion is checked separately.");
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await expect(page.locator(".genesis-toggle")).toBeEnabled();
    await page.evaluate(() => window.scrollTo(0, 0));
    const open = await sampleTransition(page);
    const close = await sampleTransition(page);
    for (const samples of [open, close]) {
      expect(samples.length).toBeGreaterThan(3);
      expect(samples.at(-1)?.phase).toBe(samples[0].phase === "resting" ? "open" : "resting");
      for (let index = 1; index < samples.length; index += 1) {
        const previous = samples[index - 1];
        const current = samples[index];
        const elapsedFrames = Math.max(1, (current.time - previous.time) / (1000 / 60));
        expect(Math.abs(current.stageHeight - previous.stageHeight), JSON.stringify({ width, index, previous, current })).toBeLessThan(85 * elapsedFrames);
        expect(Math.abs((current.belowTop - previous.belowTop) - (current.stageHeight - previous.stageHeight)), JSON.stringify({ width, index, previous, current })).toBeLessThan(4);
        expect(Math.abs(current.scrollY - samples[0].scrollY)).toBeLessThan(3);
        expect(Math.abs(current.stageTop - samples[0].stageTop)).toBeLessThan(3);
      }
    }
    expect(Math.abs(open[0].stageHeight - close.at(-1)!.stageHeight)).toBeLessThan(2);
    await expect(page.locator(".genesis-interface")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator(".genesis-toggle")).toHaveAttribute("aria-expanded", "false");
  });
}
