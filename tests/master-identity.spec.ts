import { test, expect, type Locator } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { HARULO, markSvg } from "../lib/brand/geometry";
import { REST, studies, studyPose, ringPath } from "../lib/brand/motion";

async function exactMark(mark: Locator) {
  await expect(mark).toHaveAttribute("viewBox", "0 0 100 100");
  const pieces = mark.locator('[data-harulo-pieces="4"]');
  await expect(pieces).toHaveAttribute("data-resting", "true");
  await expect(pieces.locator(":scope > *")).toHaveCount(4);
  for (const [name, attrs] of [
    ["ring", HARULO.ring],
    ["satellite", HARULO.satellite],
    ["primary-tier", HARULO.primary],
    ["secondary-tier", HARULO.secondary],
  ] as const) {
    for (const [key, value] of Object.entries(attrs))
      await expect(pieces.locator(`[data-piece="${name}"]`)).toHaveAttribute(
        key === "strokeWidth" ? "stroke-width" : key,
        String(value),
      );
  }
}

test("immutable geometry, twelve distinct continuous transformations, exact return", () => {
  expect(HARULO.ring).toEqual({
    cx: 47.5,
    cy: 41.5,
    r: 18.25,
    strokeWidth: 7.25,
  });
  expect(HARULO.satellite).toEqual({ cx: 68.9, cy: 29.2, r: 4.35 });
  expect(HARULO.primary).toEqual({
    x: 30,
    y: 58.5,
    width: 40,
    height: 6.8,
    rx: 3.4,
  });
  expect(HARULO.secondary).toEqual({
    x: 39.2,
    y: 67.6,
    width: 21.6,
    height: 5.5,
    rx: 2.75,
  });
  expect(studies).toHaveLength(12);
  expect(new Set(studies.map((s) => JSON.stringify(s.target))).size).toBe(12);
  const original = JSON.stringify(studies);
  for (const study of studies) {
    expect(studyPose(study.id, 0)).toBe(REST);
    expect(studyPose(study.id, 1)).toBe(REST);
    let previous = Object.values(REST).flatMap(Object.values) as number[];
    for (let frame = 0; frame <= 1000; frame++) {
      const pose = studyPose(study.id, frame / 1000);
      const values = Object.values(pose).flatMap(Object.values) as number[];
      expect(values.every(Number.isFinite)).toBe(true);
      expect(
        Math.max(...values.map((v, i) => Math.abs(v - previous[i]))),
        study.id,
      ).toBeLessThan(3);
      expect(ringPath(pose.ring)).not.toContain("NaN");
      previous = values;
    }
  }
  expect(JSON.stringify(studies)).toBe(original);
  expect(markSvg()).toContain('stroke-width="7.25"');
});

test("public logos, generated assets, press and icon sizes share the master", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await exactMark(page.locator(".wordmark .harulo-mark"));
  await exactMark(page.locator(".origin-mark"));
  await page.goto("/press");
  await expect(
    page.getByText("Master mark / monochrome", { exact: true }),
  ).toBeVisible();
  for (const name of [
    "harulo-master.svg",
    "harulo-reversed.svg",
    "harulo-daylight.svg",
    "harulo-publisher.svg",
    "harulo-vertical.svg",
  ]) {
    const r = await request.get(`/brand/${name}`);
    expect(r.ok()).toBe(true);
    const body = await r.text();
    for (const geometry of [
      'cx="47.5" cy="41.5" r="18.25"',
      'cx="68.9" cy="29.2" r="4.35"',
      'x="30" y="58.5" width="40" height="6.8" rx="3.4"',
      'x="39.2" y="67.6" width="21.6" height="5.5" rx="2.75"',
    ])
      expect(body).toContain(geometry);
  }
  for (const size of [16, 20, 24, 32, 48, 64, 128, 256, 512])
    expect((await request.get(`/brand/harulo-${size}.png`)).ok()).toBe(true);
  expect(await (await request.get("/favicon.svg")).text()).toContain(
    'viewBox="0 0 100 100"',
  );
});

test("mobile portal is keyboard accessible and restores trigger focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Menu", exact: true });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link"),
  ).toHaveCount(5);
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    axe.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: /Support/ })
    .click();
  await expect(page.locator("main h1")).toHaveText("Let’s get you unstuck.");
});

test.describe("official development lab", () => {
  test.beforeEach(() =>
    test.skip(
      process.env.HARULO_TEST_MODE !== "development",
      "Development-only laboratory.",
    ),
  );
  test("master first, twelve controllable destinations, archive kept separate", async ({
    page,
  }) => {
    await page.goto("/preview/identity-lab");
    await expect(page.locator("h1")).toHaveText("HARULO MASTER MARK");
    await expect(page.locator(".master-sizes figure")).toHaveCount(9);
    await expect(page.locator(".master-family figure")).toHaveCount(6);
    await exactMark(page.locator(".master-drawing .harulo-mark"));
    await page.getByRole("tab", { name: "Motion / 12 studies" }).click();
    await expect(page.locator(".study-index button")).toHaveCount(12);
    for (const study of studies) {
      await page
        .locator(".study-index button")
        .filter({ hasText: study.name })
        .click();
      await page
        .getByRole("button", { name: "02 / Destination", exact: true })
        .click();
      await expect(page.locator(".study-workbench")).toHaveAttribute(
        "data-study",
        study.id,
      );
      await expect(page.locator(".study-stage [data-piece]")).toHaveCount(4);
      await expect(page.locator(".study-stage [data-resting]")).toHaveAttribute(
        "data-resting",
        "false",
      );
      await page
        .getByRole("button", { name: "03 / Exact return", exact: true })
        .click();
      await exactMark(page.locator(".study-stage .harulo-mark"));
    }
    await page.getByRole("link", { name: "Earlier identity research" }).click();
    await expect(page.locator(".identity-lab")).toBeVisible();
    await expect(page.locator(".static-candidates > article")).toHaveCount(5);
  });
  test("finite motion, pause, slow inspection and offscreen suspension", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/preview/identity-lab");
    await page.getByRole("tab", { name: "Motion / 12 studies" }).click();
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect(page.locator(".study-workbench")).toHaveAttribute(
      "data-playing",
      "true",
    );
    await expect
      .poll(async () =>
        Number(
          await page.locator(".study-workbench").getAttribute("data-progress"),
        ),
      )
      .toBeGreaterThan(0.05);
    await page.evaluate(() => {
      document.body.style.paddingBottom = "1400px";
      scrollTo(0, document.body.scrollHeight);
    });
    await expect(page.locator(".study-workbench")).toHaveAttribute(
      "data-playing",
      "false",
    );
    const offscreenPosition = await page
      .locator(".study-workbench")
      .getAttribute("data-progress");
    await page.waitForTimeout(180);
    await expect(page.locator(".study-workbench")).toHaveAttribute(
      "data-progress",
      offscreenPosition!,
    );
    await page.evaluate(() => {
      document.body.style.paddingBottom = "";
    });
    await page.locator(".study-stage").scrollIntoViewIfNeeded();
    await expect(page.locator(".study-workbench")).toHaveAttribute(
      "data-playing",
      "true",
    );
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    await expect(page.locator(".study-workbench")).toHaveAttribute(
      "data-playing",
      "false",
    );
    const position = await page
      .locator(".study-workbench")
      .getAttribute("data-progress");
    await page.waitForTimeout(180);
    await expect(page.locator(".study-workbench")).toHaveAttribute(
      "data-progress",
      position!,
    );
    await page.getByRole("button", { name: "⅓ speed" }).click();
    await expect(page.getByRole("button", { name: "⅓ speed" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.getByRole("button", { name: "Reduced-motion preview" }).click();
    await page.getByRole("button", { name: "Show destination" }).click();
    await expect(page.locator(".study-workbench")).toHaveAttribute(
      "data-playing",
      "false",
    );
    await page.getByRole("button", { name: "03 / Exact return" }).click();
    await exactMark(page.locator(".study-stage .harulo-mark"));
  });
  test("color research, contexts, reduced-motion and mobile accessibility", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 860 });
    await page.goto("/preview/identity-lab");
    await page
      .getByRole("combobox", { name: "Color environment" })
      .selectOption("02");
    await page.reload();
    await expect(
      page.getByRole("combobox", { name: "Color environment" }),
    ).toHaveValue("02");
    await page
      .getByRole("combobox", { name: "Color environment" })
      .selectOption("master");
    for (const tab of [
      "Master & geometry",
      "Motion / 12 studies",
      "Color & tokens",
    ]) {
      await page.getByRole("tab", { name: tab }).click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        tab,
      ).toBe(true);
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        axe.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
        tab,
      ).toEqual([]);
    }
    for (const context of [
      "home",
      "software/sori",
      "releases",
      "support",
      "privacy/sori",
      "press",
      "lifecycle",
      "mobile",
      "loading",
      "transition",
    ]) {
      const response = await page.goto(`/preview/identity-lab/${context}`);
      expect(response?.ok(), context).toBe(true);
      await expect(
        page.getByRole("tab", { name: "In the website" }),
      ).toHaveAttribute("aria-selected", "true");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        context,
      ).toBe(true);
      expect(
        await page.locator('meta[name="robots"]').getAttribute("content"),
      ).toContain("noindex");
    }
  });
  test("native product navigation has progressive transition support and back works", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/preview/2036");
    await page.getByRole("link", { name: "Explore Sori" }).click();
    await expect(page.locator("main h1")).toHaveText("Sori");
    await expect(page.locator('[data-publication="sori"]')).toBeVisible();
    await page.goBack();
    await expect(
      page.getByRole("link", { name: "Explore Sori" }),
    ).toBeVisible();
  });
});

test("production never exposes the official lab or archived fictional research", async ({
  request,
}) => {
  test.skip(
    process.env.HARULO_TEST_MODE === "development",
    "Production build only.",
  );
  for (const path of [
    "/preview/identity-lab",
    "/preview/identity-lab/archive",
    "/preview/identity-lab/home",
    "/preview/identity-lab/lifecycle",
    "/preview/identity-lab/software/sori",
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
    expect(await response.text()).not.toContain("FICTIONAL ANNOUNCEMENT");
  }
});
