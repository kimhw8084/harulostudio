import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  identities,
  transformations,
  identityReel,
  poseAt,
  pathData,
  basePose,
} from "../lib/identity/geometry";
import { palettes, contrastChecks, contrast } from "../lib/identity/palettes";
import { labCatalog, archiveCatalog } from "../lib/identity/fixtures";

const root = "/preview/identity-lab";
const development = process.env.HARULO_TEST_MODE === "development";
test("identity topology and ten complete semantic palettes", () => {
  expect(palettes).toHaveLength(10);
  expect(new Set(palettes.map((p) => p.name)).size).toBe(10);
  for (const p of palettes) {
    for (const result of contrastChecks(p))
      expect(result.ratio, `${p.name}: ${result.label}`).toBeGreaterThanOrEqual(
        4.5,
      );
    expect(
      contrast(p.tokens.focus, p.tokens.background),
    ).toBeGreaterThanOrEqual(3);
  }
  const ids: string[] = [];
  for (const identity of identities) {
    const list = transformations(identity.id);
    expect(list).toHaveLength(6);
    const count = basePose(identity.id).pieces.length;
    const destinations: string[] = [];
    for (const t of [...list, identityReel(identity.id)]) {
      ids.push(t.id);
      for (const f of t.frames) {
        expect(f.pose.pieces, t.id).toHaveLength(count);
        for (const p of f.pose.pieces) {
          expect(p.points).toHaveLength(40);
          expect(p.points.flat().every(Number.isFinite)).toBe(true);
        }
      }
      const start = t.frames[0].pose.pieces.map(pathData).join();
      expect(
        t.frames.some((f) => f.pose.pieces.map(pathData).join() !== start),
        t.id,
      ).toBe(true);
      destinations.push(t.frames[1].pose.pieces.map(pathData).join());
      for (const position of [0.1, 0.35, 0.72, 0.99])
        expect(
          poseAt(t, position)
            .pieces.flatMap((p) => p.points.flat())
            .every(Number.isFinite),
        ).toBe(true);
    }
    expect(new Set(destinations.slice(0, 6)).size).toBeGreaterThanOrEqual(5);
  }
  expect(ids.filter((id) => id !== "REEL")).toHaveLength(18);
  const application = transformations("hangul").find((t) => t.id === "HF-04")!;
  for (const progress of [0.05, 0.13, 0.2, 0.3]) {
    const pieces = poseAt(application, progress).pieces;
    for (let i = 0; i < 6; i++) {
      const a = pieces[i].points.at(-1)!,
        b = pieces[(i + 1) % 6].points[0];
      expect(
        Math.hypot(a[0] - b[0], a[1] - b[1]),
        "The loop stays physically connected",
      ).toBeLessThan(0.001);
    }
  }
  expect(labCatalog.products).toHaveLength(6);
  expect(labCatalog.supportArticles.length).toBeGreaterThanOrEqual(48);
  expect(archiveCatalog.products.some((p) => p.status === "archived")).toBe(
    true,
  );
  expect(archiveCatalog.products.some((p) => p.status === "discontinued")).toBe(
    true,
  );
});

test("the lab is unavailable in production", async ({ page }) => {
  test.skip(development, "Production boundary test.");
  for (const suffix of ["", "/home", "/software/sori", "/press"]) {
    const response = await page.goto(root + suffix);
    expect(response?.status()).toBe(404);
    await expect(page.locator(".identity-lab")).toHaveCount(0);
    expect(await page.locator("body").innerText()).not.toContain("Sori 4.8");
  }
});

test.describe("development identity review", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!development, "Development-only laboratory.");
    await page.goto(root);
    await expect(
      page.locator('.identity-lab[data-ready="true"]'),
    ).toBeVisible();
  });
  test("all 18 transformations have inspectable continuous geometry", async ({
    page,
  }) => {
    test.setTimeout(90000);
    for (const candidate of identities) {
      await page
        .locator(".identity-option")
        .filter({ hasText: candidate.name })
        .click();
      await expect(page.locator(".transformation-option")).toHaveCount(7);
      for (const transformation of transformations(candidate.id)) {
        await page
          .locator(".transformation-option")
          .filter({ hasText: transformation.id })
          .click();
        const paths = page.locator(".transformation-stage [data-piece]");
        const start = await paths.evaluateAll((nodes) =>
          nodes.map((n) => n.getAttribute("d")),
        );
        await page.getByRole("button", { name: /^State 2/ }).click();
        const end = await paths.evaluateAll((nodes) =>
          nodes.map((n) => n.getAttribute("d")),
        );
        expect(start, transformation.id).not.toEqual(end);
        await expect(
          page.getByRole("slider", { name: "Transformation timeline" }),
        ).toBeVisible();
      }
      await page.locator(".reel-option").click();
      await expect(page.locator(".stage-top")).toContainText("REEL");
    }
  });
  test("play pause replay slow motion and reduced-motion states", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page
      .locator(".transformation-option")
      .filter({ hasText: "HF-04" })
      .click();
    await page
      .getByRole("button", { name: "Play transformation", exact: true })
      .click();
    await page.locator(".transformation-stage").scrollIntoViewIfNeeded();
    await expect
      .poll(async () =>
        Number(
          await page
            .locator(".transformation-player")
            .getAttribute("data-progress"),
        ),
      )
      .toBeGreaterThan(0.025);
    await page
      .getByRole("button", { name: "Pause transformation", exact: true })
      .click();
    const paused = await page
      .locator(".transformation-player")
      .getAttribute("data-progress");
    await page.waitForTimeout(150);
    await expect(page.locator(".transformation-player")).toHaveAttribute(
      "data-progress",
      paused!,
    );
    await page.getByLabel("Playback speed").selectOption("0.25");
    await page.getByRole("button", { name: "Replay transformation" }).click();
    await expect(page.locator(".transformation-player")).toHaveAttribute(
      "data-playing",
      "true",
    );
    await page.getByRole("switch", { name: "Reduced-motion preview" }).click();
    await expect(
      page.getByRole("button", { name: "Play transformation", exact: true }),
    ).toBeDisabled();
    await page.getByRole("button", { name: /^State 2/ }).click();
    await expect(page.locator(".stage-bottom")).toContainText("SORI");
  });
  test("independent choices persist, pins restore, comparisons stay bounded", async ({
    page,
  }) => {
    await page
      .locator(".identity-option")
      .filter({ hasText: "Solar Aperture" })
      .click();
    await page
      .locator(".transformation-option")
      .filter({ hasText: "SA-04" })
      .click();
    await page.getByLabel("Color system", { exact: true }).selectOption("09");
    await page.getByRole("button", { name: "Pin combination" }).click();
    await page.reload();
    await expect(page.locator(".lab-review-strip")).toContainText(
      "Solar Aperture / SA-04 / Saffron Circuit",
    );
    await page.getByRole("tab", { name: "Compare", exact: true }).click();
    await expect(page.locator(".comparison-world")).toHaveCount(3);
    await page.getByLabel("Comparison mode").selectOption("palettes");
    await page.getByLabel("Second comparison palette").selectOption("05");
    await expect(page.locator(".comparison-world").nth(1)).toContainText(
      "Midnight Sun",
    );
    await page.getByLabel("Website context").selectOption("software/sori");
    await expect(page.locator(".lab-site")).toHaveAttribute(
      "data-identity",
      "aperture",
    );
    await expect(page.locator(".lab-site")).toHaveAttribute(
      "data-palette",
      "09",
    );
    await expect(page.locator(".lab-site h1")).toHaveText("Sori");
    await page.getByRole("link", { name: "Product privacy" }).click();
    await expect(page.locator(".lab-site")).toContainText(
      "Fictional Sori privacy example",
    );
  });
  test("palette proof, keyboard controls and mobile reflow", async ({
    page,
  }, info) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 320, height: 720 });
    for (const tab of [
      "Motion studio",
      "Static & scale",
      "Compare",
      "Color systems",
    ]) {
      await page.getByRole("tab", { name: new RegExp(tab) }).click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        tab,
      ).toBe(true);
    }
    for (const palette of palettes) {
      await page
        .getByLabel("Color system", { exact: true })
        .selectOption(palette.id);
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        audit.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        palette.name,
      ).toEqual([]);
    }
    await page.getByRole("tab", { name: /Motion studio/ }).click();
    const slider = page.getByRole("slider", {
      name: "Transformation timeline",
    });
    await slider.focus();
    await page.keyboard.press("ArrowRight");
    await expect(slider).toHaveAttribute("aria-valuenow", "0.1");
    await page.screenshot({
      path: `work/${info.project.name}-identity-mobile.png`,
      fullPage: true,
    });
  });
  test("complete publishing contexts stay real, fictional and accessible", async ({
    page,
  }) => {
    test.setTimeout(180000);
    for (const context of [
      "home",
      "software/sori",
      "software/namu",
      "releases/sori/4.8.2",
      "support/namu",
      "privacy/sori",
      "press",
      "archive",
      "social",
      "mobile",
      "favicon",
      "loading",
      "transition",
      "empty",
    ]) {
      await page.goto(`${root}/${context}`);
      await page.setViewportSize({ width: 320, height: 720 });
      await expect(page.locator(".lab-site")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        context,
      ).toBe(true);
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        audit.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        context,
      ).toEqual([]);
    }
  });

  test("all ten worlds cover the six open application demos", async ({
    page,
  }) => {
    test.setTimeout(180000);
    await page.goto(`${root}/home`);
    await expect(
      page.locator('.identity-lab[data-ready="true"]'),
    ).toBeVisible();
    for (const name of ["Namu", "Goyo", "Haru Weather", "Dami", "Morrow"])
      await page.getByLabel(`Toggle ${name} edition`).click();
    for (const palette of palettes) {
      await page
        .getByLabel("Color system", { exact: true })
        .selectOption(palette.id);
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        audit.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        palette.name,
      ).toEqual([]);
    }
  });

  test("storage denial and JavaScript-free rendering keep the review honest", async ({
    browser,
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(Storage.prototype, "getItem", {
        value() {
          throw new Error("Storage unavailable");
        },
      });
      Object.defineProperty(Storage.prototype, "setItem", {
        value() {
          throw new Error("Storage unavailable");
        },
      });
    });
    await page.reload();
    await expect(page.locator(".lab-status")).toContainText(
      "Browser storage is unavailable",
    );
    await page
      .locator(".identity-option")
      .filter({ hasText: "Horizon Core" })
      .click();
    await expect(page.locator(".lab-review-strip")).toContainText(
      "Horizon Core",
    );
    const context = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await context.newPage();
    await staticPage.goto(`${process.env.HARULO_TEST_URL}${root}/home`);
    await expect(staticPage.locator(".lab-noscript")).toBeVisible();
    await expect(
      staticPage.locator(".lab-site-header .identity-vector path"),
    ).toHaveCount(19);
    await expect(staticPage.locator(".product-edition")).toHaveCount(6);
    await expect(staticPage.locator(".lab-hero h1")).toContainText("HARULO");
    await context.close();
  });
});
