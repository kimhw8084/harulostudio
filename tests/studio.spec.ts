import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export async function expectReflow(page: Page) {
  const geometry = await page.evaluate(() => ({
    page: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
    overflowing: [...document.querySelectorAll<HTMLElement>("body *")]
      .filter((el) => el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 2)
      .map((el) => ({
        tag: el.tagName,
        class: el.className,
        width: el.clientWidth,
        scroll: el.scrollWidth,
      })),
    clipped: [
      ...document.querySelectorAll("h1,h2,h3,p,nav,a,button,input,select"),
    ]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return (
          r.width > 0 &&
          !el.classList.contains("skip-link") &&
          !el.classList.contains("sr-only") &&
          (r.right > innerWidth + 1 || r.left < -1)
        );
      })
      .map((el) => el.textContent?.trim().slice(0, 80)),
  }));
  expect(geometry.page, JSON.stringify(geometry)).toBeLessThanOrEqual(
    geometry.viewport + 1,
  );
  expect(geometry.clipped).toEqual([]);
}
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
});

test("publisher identity, working Dayfold, navigation and theme persistence", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".publisher-eyebrow")).toHaveText(
    "Independent software publisher",
  );
  await expect(page.locator(".hero-description")).toContainText(
    "design, build, publish and maintain",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText("HARULO");
  await page.getByRole("button", { name: "Open the day" }).click();
  await expect(page.getByRole("timer")).toHaveText("01:00");
  await page.getByRole("button", { name: "Start minute" }).click();
  await expect(page.getByRole("button", { name: "Pause timer" })).toBeVisible();
  await page.getByRole("button", { name: "Pause timer" }).click();
  await page.getByRole("button", { name: "Reset minute" }).click();
  await expect(page.getByRole("timer")).toHaveText("01:00");
  await page.getByRole("button", { name: "Fold it back" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Open the day" }),
  ).toBeFocused();
  await expect(page.getByRole("timer")).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: `work/${info.project.name}-publisher-daylight.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Low-light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "evening");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "evening");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Software", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Software for everyday life.",
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "evening");
  await page.getByRole("link", { name: "Harulo Studio home" }).click();
  await page.getByRole("link", { name: "Say hello", exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(
    page.getByRole("link", { name: "harulostudio@gmail.com", exact: true }),
  ).toHaveAttribute("href", "mailto:harulostudio@gmail.com");
  await page.getByRole("link", { name: "Back to top" }).click();
  await page.screenshot({
    path: `work/${info.project.name}-publisher-evening.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("320px, landscape, enlarged text and spacing retain content", async ({
  page,
}, info) => {
  await page.goto("/");
  for (const size of [
    { width: 390, height: 844 },
    { width: 320, height: 568 },
    { width: 844, height: 390 },
    { width: 768, height: 1024 },
  ]) {
    await page.setViewportSize(size);
    await expectReflow(page);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: `work/${info.project.name}-publisher-mobile.png`,
    fullPage: true,
  });
  await page.addStyleTag({ content: "html { font-size:200% !important; }" });
  await expectReflow(page);
  await page.addStyleTag({
    content:
      "* { line-height:1.5 !important; letter-spacing:.12em !important; word-spacing:.16em !important; } p { margin-bottom:2em !important; }",
  });
  await expectReflow(page);
  await page.getByRole("button", { name: "Open the day" }).click();
  await expectReflow(page);
  await page.getByRole("button", { name: "Start minute" }).click();
  await expect(page.getByRole("button", { name: "Pause timer" })).toBeVisible();
  await page.getByRole("link", { name: "Say hello", exact: true }).click();
  const email = page.getByRole("link", {
    name: "harulostudio@gmail.com",
    exact: true,
  });
  await email.scrollIntoViewIfNeeded();
  await expect(email).toBeInViewport();
});

test("geometry oracle detects an overwide component", async ({ page }) => {
  await page.goto("/");
  await page.setViewportSize({ width: 320, height: 568 });
  await expectReflow(page);
  await page.evaluate(() => {
    const bad = document.createElement("button");
    bad.id = "fault-fixture";
    bad.style.width = "2000px";
    bad.textContent = "fault injection";
    document.body.appendChild(bad);
  });
  await expect(expectReflow(page)).rejects.toThrow();
  await page.evaluate(() => document.getElementById("fault-fixture")?.remove());
  await expectReflow(page);
});

test("automated accessibility in both environments and useful pages", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/software",
    "/releases",
    "/studio",
    "/support",
    "/press",
  ]) {
    await page.goto(path);
    for (const theme of ["daylight", "evening"]) {
      if (theme === "evening")
        await page.getByRole("button", { name: "Low-light mode" }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      ).toEqual([]);
    }
    await page.getByRole("button", { name: "Low-light mode" }).click();
  }
});

test("keyboard skip, native links and Dayfold controls", async ({
  page,
  browserName,
}) => {
  await page.goto("/");
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const theme = page.getByRole("button", { name: "Low-light mode" });
  await theme.focus();
  await page.keyboard.press("Space");
  await expect(theme).toHaveAttribute("aria-pressed", "true");
  expect(
    await theme.evaluate((el) => getComputedStyle(el).outlineStyle),
  ).not.toBe("none");
  await page.getByRole("button", { name: "Open the day" }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Start minute" }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("button", { name: "Pause timer" })).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.getByRole("timer")).toBeVisible();
  const a = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(a.violations).toEqual([]);
});

test("minute timer pauses, resumes, completes and resets without drift", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await page.getByRole("button", { name: "Open the day" }).click();
  await page.getByRole("button", { name: "Start minute" }).click();
  await page.clock.fastForward(12000);
  await expect(page.getByRole("timer")).toHaveText("00:48");
  await page.getByRole("button", { name: "Pause timer" }).click();
  await page.clock.fastForward(10000);
  await expect(page.getByRole("timer")).toHaveText("00:48");
  await page.getByRole("button", { name: "Resume timer" }).click();
  await page.clock.fastForward(48000);
  await expect(page.getByRole("timer")).toHaveText("00:00");
  await expect(page.locator(".minute-message")).toContainText(
    "A little space, made.",
  );
  await expect(page.locator(".fold-slat[data-spent=true]")).toHaveCount(24);
  await page.getByRole("button", { name: "Reset minute" }).click();
  await expect(page.getByRole("timer")).toHaveText("01:00");
  await expect(page.locator(".fold-slat[data-spent=true]")).toHaveCount(0);
});

test("motion preference, pause, resume and offscreen animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "running");
  await expect(page.locator(".dayfold")).toHaveAttribute(
    "data-in-view",
    "true",
  );
  expect(
    await page
      .locator(".fold-breath")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("fold-breathe");
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await page.getByRole("button", { name: "Resume motion" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "running");
  await expect(page.locator(".dayfold")).toHaveAttribute(
    "data-in-view",
    "false",
  );
  expect(
    await page
      .locator(".fold-breath")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: "Motion reduced" }),
  ).toBeDisabled();
});

test("clipboard rejection, retry and actual readback", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Real clipboard permissions exercised in Chromium.",
  );
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.evaluate(() => {
    (window as unknown as { originalWrite: unknown }).originalWrite =
      navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText = async () => {
      throw new Error("denied");
    };
  });
  await page.getByRole("button", { name: "Copy email", exact: true }).click();
  await expect(page.locator(".copy-status")).toContainText("Couldn’t copy");
  await page.evaluate(() => {
    navigator.clipboard.writeText = (
      window as unknown as {
        originalWrite: typeof navigator.clipboard.writeText;
      }
    ).originalWrite;
  });
  await page.getByRole("button", { name: "Copy email", exact: true }).click();
  await expect(page.locator(".copy-status")).toHaveText("Email copied.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "harulostudio@gmail.com",
  );
});

test("storage denial and failed fonts do not block tasks or override manual theme", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("denied");
    };
    Storage.prototype.setItem = () => {
      throw new Error("denied");
    };
  });
  await page.route("**/fonts/*.woff2", (r) => r.abort());
  await page.goto("/");
  await page.getByRole("button", { name: "Low-light mode" }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "evening");
  await expectReflow(page);
  await page.getByRole("button", { name: "Open the day" }).click();
  await page.getByRole("button", { name: "Start minute" }).click();
  await expect(page.getByRole("button", { name: "Pause timer" })).toBeVisible();
});

test("forced colors retains control focus and layout", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Forced colors emulation exercised in Chromium.",
  );
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/");
  const theme = page.getByRole("button", { name: "Low-light mode" });
  await theme.focus();
  expect(
    await theme.evaluate((el) => getComputedStyle(el).outlineStyle),
  ).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(theme).toHaveAttribute("aria-pressed", "true");
  await expectReflow(page);
});

test("no-JavaScript reading, navigation and contact", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(process.env.HARULO_TEST_URL || "http://127.0.0.1:8791");
  await expect(page.locator(".publisher-eyebrow")).toContainText(
    "software publisher",
  );
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Software", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Software for everyday life.",
  );
  await expect(
    page.getByRole("link", { name: "Contact the studio" }),
  ).toHaveAttribute("href", "mailto:harulostudio@gmail.com");
  await context.close();
});

test("production excludes fictional editions, including routes and discovery", async ({
  request,
}) => {
  test.skip(
    process.env.HARULO_TEST_MODE === "development",
    "Production gate tested against the Worker build.",
  );
  for (const path of [
    "/preview/2036",
    "/preview/2036/software/sori",
    "/software/sori",
    "/releases/sori/4.8.2",
    "/support/namu",
    "/software/missing/privacy",
  ]) {
    const r = await request.get(path);
    expect(r.status(), path).toBe(404);
    expect(await r.text()).not.toContain("fictional interface concept");
  }
  for (const path of ["/", "/software", "/releases", "/sitemap.xml"]) {
    const r = await request.get(path);
    expect(r.ok()).toBeTruthy();
    const body = await r.text();
    for (const name of ["Sori", "Namu", "Goyo", "Morrow", "2036"]) {
      expect(body, `${path}: ${name}`).not.toContain(name);
    }
  }
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /preview/");
});
