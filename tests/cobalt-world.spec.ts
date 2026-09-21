import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { themes, migrateTheme } from "../lib/brand/themes";
import {
  productionSystems,
  resolveChannels,
  quietScene,
} from "../lib/brand/scene";
import { demoCatalog } from "../lib/publishing/fixtures";
import { validateCatalog } from "../lib/publishing/catalog";

function luminance(hex: string) {
  const values = hex
    .slice(1)
    .match(/../g)!
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
test("permanent palette, migration, channels and mature relational universe", () => {
  expect(migrateTheme("evening")).toBe("dark");
  expect(migrateTheme("daylight")).toBe("light");
  expect(migrateTheme("unknown")).toBeNull();
  for (const theme of Object.values(themes))
    for (const [fg, bg] of [
      [theme.foreground, theme.background],
      [theme["muted-foreground"], theme.background],
      [theme["muted-foreground"], theme.card],
      [theme["primary-foreground"], theme.primary],
      [theme["signal-text"], theme.background],
      [theme.success, theme.background],
      [theme.destructive, theme.background],
    ])
      expect(contrast(fg, bg), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
  expect(productionSystems).toHaveLength(24);
  expect(Object.keys(resolveChannels(quietScene))).toEqual([
    "ring",
    "satellite",
    "primaryTier",
    "secondaryTier",
  ]);
  expect(validateCatalog(demoCatalog)).toEqual([]);
  expect(demoCatalog.products).toHaveLength(12);
  expect(demoCatalog.releases.length).toBeGreaterThanOrEqual(150);
  expect(demoCatalog.releases.length).toBeLessThanOrEqual(250);
  expect(demoCatalog.supportArticles).toHaveLength(96);
  expect(demoCatalog.pressItems).toHaveLength(24);
  for (const p of demoCatalog.products) {
    expect(p.privacy?.history.length).toBeGreaterThan(1);
    expect(p.history?.length).toBeGreaterThan(1);
    expect(p.requirements.length).toBe(p.platforms.length);
    if (p.successorId)
      expect(demoCatalog.products.some((v) => v.id === p.successorId)).toBe(
        true,
      );
  }
  for (const r of demoCatalog.releases)
    if (r.previousVersion)
      expect(
        demoCatalog.releases.some(
          (v) => v.productId === r.productId && v.version === r.previousVersion,
        ),
      ).toBe(true);
});
test("saved legacy theme migrates to the permanent semantic state", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("harulo-theme", "evening"),
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Dark mode" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: "Dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => localStorage.getItem("harulo-theme"))).toBe(
    "light",
  );
});
test("the instrument remains useful when Canvas is unavailable", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: () => null,
    }),
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("button", { name: "Open a little space" }).click();
  await expect(
    page.getByRole("button", { name: "Start minute" }),
  ).toBeVisible();
  await expect(page.locator(".environment-static")).toBeVisible();
});
test.describe("mature Cobalt Ember world", () => {
  test.beforeEach(() =>
    test.skip(
      process.env.HARULO_TEST_MODE !== "development",
      "Synthetic universe is development-only.",
    ),
  );
  test("year signal, local memory, archive, support and release continuity", async ({
    page,
  }) => {
    await page.goto("/preview/2036/history");
    await page.getByRole("button", { name: "2028", exact: true }).click();
    await expect(page.locator(".chrono-year")).toHaveText("2028");
    await page.reload();
    await expect(page.locator(".chrono-year")).toHaveText("2028");
    await page.getByRole("button", { name: "Clear local memory" }).click();
    await expect(page.locator(".chrono-year")).toHaveText("2036");
    await page.goto("/preview/2036/archive");
    await expect(page.locator(".archive-entry")).toHaveCount(3);
    await page.getByRole("link", { name: "Moa ↗", exact: true }).click();
    await expect(page.locator("main h1")).toHaveText("Moa");
    await page.getByRole("link", { name: "Product support" }).click();
    await expect(page.locator(".support-list li")).toHaveCount(8);
    await page
      .getByRole("link", { name: "Moving between major editions" })
      .click();
    await expect(page.locator("main")).toContainText("Namu");
    await page.goto("/preview/2036/releases?product=sori&channel=stable");
    const current = await page.locator(".river-current h3").textContent();
    await page.getByRole("button", { name: "Earlier", exact: true }).click();
    await expect(page.locator(".river-current h3")).not.toHaveText(current!);
    await page.getByRole("link", { name: "Read this release" }).click();
    await expect(page.locator("main")).toContainText("Sori");
  });
  test("data comparison is functional; X-ray explains the actual local boundary", async ({
    page,
  }) => {
    await page.goto("/preview/2036/software/gyeol");
    const tab = page.getByRole("tab", { name: "Interface", exact: true });
    await tab.scrollIntoViewIfNeeded();
    expect(
      await tab.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return element.contains(
          document.elementFromPoint(rect.left + 4, rect.top + rect.height / 2),
        );
      }),
    ).toBe(true);
    await page.getByRole("button", { name: "Compare documents" }).click();
    await expect(page.locator(".instrument-output")).toContainText(
      'theme: "light" → "dark"',
    );
    await page.getByRole("tab", { name: "Data boundary", exact: true }).click();
    await expect(page.locator(".xray-reading")).toContainText(
      "transient browser memory",
    );
    await page.getByLabel("Earlier", { exact: true }).fill("not json");
    await page.getByRole("button", { name: "Compare documents" }).click();
    await expect(page.locator(".instrument-output")).toContainText(
      "Invalid JSON",
    );
  });
  test("new routes are readable, noindex, accessible and responsive in both themes", async ({
    page,
  }, info) => {
    for (const width of [390, 1440])
      for (const mode of ["light", "dark"] as const) {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" });
        for (const [route, name] of [
          ["", "home"],
          ["/history", "history"],
          ["/archive", "archive"],
          ["/support/namu/export", "support"],
          ["/software/gyeol", "product"],
          ["/press/duru-current", "press"],
          ["/software/namu/privacy", "privacy"],
        ]) {
          await page.goto("/preview/2036" + route);
          await expect(page.locator("html")).toHaveAttribute(
            "data-enhanced",
            "true",
          );
          expect(
            await page.locator('meta[name="robots"]').getAttribute("content"),
          ).toContain("noindex");
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
          ).toBe(true);
          const result = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
          expect(
            result.violations.map((v) => ({
              id: v.id,
              nodes: v.nodes.map((n) => n.target),
            })),
            `${name}/${width}/${mode}`,
          ).toEqual([]);
          await page.screenshot({
            path: `work/cobalt-${info.project.name}-${name}-${width}-${mode}.png`,
            fullPage: true,
          });
        }
      }
  });
  test("all environments sleep and retain a static fallback", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/preview/identity-lab");
    await page.getByRole("tab", { name: "Living environments" }).click();
    for (const material of ["flow", "chrono", "membrane"]) {
      await page
        .getByLabel("Environment", { exact: true })
        .selectOption(material);
      await page.getByLabel("Rendering tier").selectOption("full");
      const stage = page.locator(".environment-review");
      await stage.scrollIntoViewIfNeeded();
      await stage.click({ position: { x: 80, y: 80 } });
      await expect(stage).toHaveAttribute("data-active", "true");
      await expect(stage).toHaveAttribute("data-active", "false", {
        timeout: 5000,
      });
      await page.getByLabel("Rendering tier").selectOption("static");
      await expect(stage).toHaveAttribute("data-quality", "static");
      await expect(stage.locator("canvas")).toBeHidden();
      await expect(stage.locator(".environment-static")).toBeVisible();
    }
  });
});
