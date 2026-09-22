import { expect, test } from "@playwright/test";

test("compiled homepage meets documented mobile performance budgets @perf", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Performance gate uses Chromium's stable renderer.");
  const samples: { fcp: number; lcp: number; cls: number; js: number }[] = [];
  for (let index = 0; index < 3; index += 1) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.addInitScript(() => {
      const state = { lcp: 0, cls: 0 };
      (window as Window & { __haruloPerf?: typeof state }).__haruloPerf = state;
      try {
        new PerformanceObserver((list) => {
          const last = list.getEntries().at(-1);
          if (last) state.lcp = last.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
            if (!shift.hadRecentInput) state.cls += shift.value ?? 0;
          }
        }).observe({ type: "layout-shift", buffered: true });
      } catch {
        /* Optional performance observers are unavailable in some engines. */
      }
    });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    const metrics = await page.evaluate(() => {
      const paint = performance.getEntriesByType("paint").find((entry) => entry.name === "first-contentful-paint");
      const lcp = performance.getEntriesByType("largest-contentful-paint").at(-1) as PerformanceEntry | undefined;
      const cls = performance.getEntriesByType("layout-shift").reduce((sum, entry) => sum + ((entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean }).hadRecentInput ? 0 : (entry as PerformanceEntry & { value?: number }).value ?? 0), 0);
      const js = performance.getEntriesByType("resource").filter((entry) => entry.name.includes("/_next/") && entry.name.endsWith(".js")).reduce((sum, entry) => sum + ((entry as PerformanceResourceTiming).encodedBodySize || 0), 0);
      const observed = (window as Window & { __haruloPerf?: { lcp: number; cls: number } }).__haruloPerf;
      return { fcp: paint?.startTime ?? 0, lcp: observed?.lcp || lcp?.startTime || 0, cls: observed?.cls || cls, js };
    });
    samples.push(metrics);
    await context.close();
  }
  const sortedLcp = samples.map((sample) => sample.lcp).sort((a, b) => a - b);
  const worst = sortedLcp.at(-1) ?? 0;
  const median = sortedLcp[1] ?? worst;
  const js = Math.max(...samples.map((sample) => sample.js));
  const cls = Math.max(...samples.map((sample) => sample.cls));
  console.log(JSON.stringify({ profile: "Chromium mobile 390x844, reduced motion, three cold contexts", samples, medianLcp: median, worstLcp: worst, maxCls: cls, maxInitialJs: js }));
  expect(js).toBeLessThanOrEqual(200_000);
  expect(worst, "Chromium did not expose an LCP sample").toBeGreaterThan(0);
  expect(worst).toBeLessThanOrEqual(2500);
  expect(cls).toBeLessThanOrEqual(0.1);
});
