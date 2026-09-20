import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  test.skip(
    process.env.HARULO_TEST_MODE !== "development",
    "Fictional edition only exists on the development server.",
  );
  await page.emulateMedia({ colorScheme: "light" });
});
test("mature catalog to product, release and support", async ({
  page,
}, info) => {
  await page.goto("/preview/2036");
  await expect(
    page.getByRole("complementary", { name: "Fictional design edition" }),
  ).toContainText("Fictional products and releases");
  await expect(page.locator(".product-edition")).toHaveCount(6);
  await page.locator('html[data-enhanced="true"]').waitFor();
  await page.screenshot({
    path: `work/${info.project.name}-mature-home.png`,
    fullPage: true,
  });
  await page.getByRole("link", { name: "Explore Sori" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sori");
  await expect(
    page.getByText("No software is available to download.", { exact: false }),
  ).toBeVisible();
  await page.locator('html[data-enhanced="true"]').waitFor();
  await page.screenshot({
    path: `work/${info.project.name}-sori-detail.png`,
    fullPage: true,
  });
  await page.locator(".release-row").first().getByRole("link").click();
  await expect(
    page.getByRole("heading", { name: "Improvements", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Improved Bluetooth device switching", { exact: true }),
  ).toBeVisible();
  await page.goto("/preview/2036/support/sori");
  await page.getByRole("link", { name: "Getting started with Sori" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Getting started with Sori",
  );
  await page.goto("/preview/2036/software/namu");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Namu");
  await page.locator('html[data-enhanced="true"]').waitFor();
  await page.screenshot({
    path: `work/${info.project.name}-namu-detail.png`,
    fullPage: true,
  });
});
test("catalog filtering and release archive combinations", async ({ page }) => {
  await page.goto("/preview/2036/software");
  await page.getByLabel("Find software").fill("Sori");
  await page.getByLabel("Platforms").selectOption("Windows");
  await page.getByRole("button", { name: "Filter software" }).click();
  await expect(page.locator(".product-edition")).toHaveCount(1);
  await expect(page.locator(".product-edition h3")).toContainText("Sori");
  await page.getByLabel("Find software").fill("No such edition");
  await page.getByRole("button", { name: "Filter software" }).click();
  await expect(
    page.getByRole("heading", { name: "No editions match." }),
  ).toBeVisible();
  await page.goto("/preview/2036/releases");
  await page.getByLabel("Products", { exact: true }).selectOption("sori");
  await page.getByLabel("Years", { exact: true }).selectOption("2036");
  await page.getByLabel("Types", { exact: true }).selectOption("maintenance");
  await page.getByRole("button", { name: "Filter releases" }).click();
  await expect(page.locator(".release-row")).toHaveCount(1);
  await expect(page.locator(".release-row")).toContainText("4.8.2");
});
test("growth browsing and pagination preserve working destinations", async ({
  page,
}) => {
  await page.goto("/preview/2036/growth/software");
  await expect(page.locator(".product-edition")).toHaveCount(12);
  await page.getByRole("link", { name: "Next", exact: true }).click();
  await expect(page.locator(".product-edition")).toHaveCount(8);
  await page.getByLabel("Toggle Edition 20 edition").click();
  await page.getByRole("link", { name: "Explore Edition 20" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Edition 20",
  );
  await page.goto("/preview/2036/growth/releases");
  await expect(page.locator(".release-row")).toHaveCount(12);
  await expect(
    page.getByRole("navigation", { name: "Result pages" }),
  ).toContainText("Page 1 of 20");
  await page.getByRole("link", { name: "Next", exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await page.locator(".release-row").first().getByRole("link").click();
  await expect(
    page.getByRole("heading", { name: "Improvements", exact: true }),
  ).toBeVisible();
});
test("mature pages retain accessible mobile layouts and theme contrast", async ({
  page,
}, info) => {
  for (const path of [
    "/preview/2036",
    "/preview/2036/software",
    "/preview/2036/software/sori",
    "/preview/2036/software/namu",
    "/preview/2036/releases",
    "/preview/2036/support/sori",
  ]) {
    await page.goto(path);
    await page.setViewportSize({ width: 320, height: 720 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      path,
    ).toBe(true);
    for (const theme of ["daylight", "evening"]) {
      if (theme === "evening")
        await page.getByRole("button", { name: "Low-light mode" }).click();
      const a = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        a.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        `${path} ${theme}`,
      ).toEqual([]);
    }
    await page.getByRole("button", { name: "Low-light mode" }).click();
  }
  await page.goto("/preview/2036");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('html[data-enhanced="true"]').waitFor();
  await page.screenshot({
    path: `work/${info.project.name}-mature-mobile.png`,
    fullPage: true,
  });
});

test("publication spines open to usable, clearly fictional applications", async ({
  page,
}) => {
  await page.goto("/preview/2036");
  await page.getByRole("button", { name: "Increase Music volume" }).click();
  await expect(page.getByLabel("Music volume", { exact: true })).toHaveText(
    "69%",
  );
  await page.getByRole("button", { name: "Quiet mode" }).click();
  await expect(page.getByLabel("Music volume", { exact: true })).toHaveText(
    "0%",
  );
  await page.getByRole("button", { name: "Quiet mode" }).click();
  await expect(page.getByLabel("Music volume", { exact: true })).toHaveText(
    "69%",
  );
  await page.getByLabel("Toggle Namu edition").focus();
  await page.keyboard.press("Enter");
  await page.getByLabel("Try a Namu note").fill("조금 더 나은 하루로.");
  await expect(page.getByLabel("Try a Namu note")).toHaveValue(
    "조금 더 나은 하루로.",
  );
  await page.getByLabel("Toggle Goyo edition").click();
  const goyo = page
    .locator(".product-edition")
    .filter({ has: page.getByRole("heading", { name: "Goyo" }) });
  await goyo.getByRole("button", { name: "Start minute" }).click();
  await expect(goyo.getByRole("button", { name: "Pause timer" })).toBeVisible();
  await goyo.getByRole("button", { name: "Reset minute" }).click();
  await page.getByLabel("Toggle Haru Weather edition").click();
  await page.getByRole("button", { name: "Tomorrow", exact: true }).click();
  await expect(page.locator(".weather-temperature")).toHaveText("21°");
  await page.getByLabel("Toggle Dami edition").click();
  await page.getByRole("button", { name: "Last week" }).click();
  await expect(page.locator(".spending-amount")).toHaveText("$312.00");
  await page.getByLabel("Toggle Morrow edition").click();
  await page.getByRole("checkbox", { name: "Step outside" }).check();
  await expect(
    page.getByRole("checkbox", { name: "Step outside" }),
  ).toBeChecked();
  await page.setViewportSize({ width: 320, height: 720 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  const a = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    a.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});
