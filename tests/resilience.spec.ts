import { test, expect } from "@playwright/test";

test("touch navigation, theme and working study", async ({ browser }, info) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(process.env.HARULO_TEST_URL || "http://127.0.0.1:8791");
  await page.getByRole("button", { name: "Evening theme" }).tap();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "evening");
  await page.getByLabel("One thing for today").tap();
  await page.getByLabel("One thing for today").fill("조금 더 나은 하루로");
  await page.getByRole("button", { name: "Keep in view" }).tap();
  await expect(page.locator(".study-result")).toContainText(
    "조금 더 나은 하루로",
  );
  await page.screenshot({
    path: `work/${info.project.name}-touch-study.png`,
    fullPage: true,
  });
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Support" })
    .tap();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Let’s get you unstuck.",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await context.close();
});

test("production on a throttled connection and CPU", async ({
  page,
  context,
  browserName,
}, info) => {
  test.skip(
    browserName !== "chromium" ||
      process.env.HARULO_TEST_MODE === "development",
    "CDP throttling measured against Chromium production only.",
  );
  const session = await context.newCDPSession(page);
  await session.send("Network.enable");
  await session.send("Network.setCacheDisabled", { cacheDisabled: true });
  await session.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: 750000 / 8,
    uploadThroughput: 250000 / 8,
  });
  await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    new PerformanceObserver((list) => {
      const entry = list.getEntries().at(-1);
      if (entry)
        document.documentElement.dataset.testLcp = String(entry.startTime);
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".publisher-eyebrow")).toHaveText(
    "Independent software publisher",
  );
  await expect(page.getByLabel("One thing for today")).toBeEnabled({
    timeout: 15000,
  });
  await page.waitForLoadState("load");
  await expect
    .poll(() =>
      page
        .locator(".solar-art img")
        .evaluate((img) => (img as HTMLImageElement).complete),
    )
    .toBe(true);
  // Give buffered paint observers a frame to report before any input ends LCP.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  const metrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType(
      "resource",
    ) as PerformanceResourceTiming[];
    return {
      fcpMs: performance.getEntriesByName("first-contentful-paint")[0]
        ?.startTime,
      lcpMs: Number(document.documentElement.dataset.testLcp),
      transferBytes: resources.reduce((n, r) => n + r.transferSize, 0),
      scriptBytes: resources
        .filter((r) => /\.m?js$/.test(new URL(r.name).pathname))
        .reduce((n, r) => n + r.encodedBodySize, 0),
      heroImage: (document.querySelector(".solar-art img") as HTMLImageElement)
        .currentSrc,
      resources: resources.map((r) => ({
        name: new URL(r.name).pathname,
        encodedBytes: r.encodedBodySize,
      })),
    };
  });
  await info.attach("throttled-production-metrics", {
    body: JSON.stringify(metrics, null, 2),
    contentType: "application/json",
  });
  expect(metrics.heroImage).toContain("daylight-640.webp");
  expect(metrics.scriptBytes).toBeLessThan(200000);
  await page.getByLabel("One thing for today").fill("A small useful thing");
  await page.getByRole("button", { name: "Keep in view" }).click();
  await expect(page.locator(".study-result")).toContainText(
    "A small useful thing",
  );
});
