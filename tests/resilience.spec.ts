import { test, expect } from "@playwright/test";

test("touch navigation, theme and working Software Origin", async ({
  browser,
}, info) => {
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
  await page.getByRole("button", { name: "Dark mode" }).tap();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Open a little space" }).tap();
  await page.getByRole("button", { name: "Start minute" }).tap();
  await expect(page.getByRole("button", { name: "Pause timer" })).toBeVisible();
  await page.getByRole("button", { name: "Pause timer" }).tap();
  await page.screenshot({
    path: `work/${info.project.name}-touch-origin.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Menu", exact: true }).tap();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
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
  await expect(
    page.getByRole("button", { name: "Open a little space" }),
  ).toBeEnabled({
    timeout: 15000,
  });
  await page.waitForLoadState("load");
  await page.evaluate(() => document.fonts.ready);
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
      heroPrimitives: document.querySelectorAll(".origin-mark [data-piece]")
        .length,
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
  expect(metrics.heroPrimitives).toBe(4);
  expect(metrics.resources.some((r) => r.name.includes("daylight-"))).toBe(
    false,
  );
  expect(metrics.scriptBytes).toBeLessThan(200000);
  await page.getByRole("button", { name: "Open a little space" }).click();
  await page.getByRole("button", { name: "Start minute" }).click();
  await expect(page.getByRole("button", { name: "Pause timer" })).toBeVisible();
});
