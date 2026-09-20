import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectReflow(page: Page) {
  const geometry = await page.evaluate(() => ({
    page: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
    clipped: [...document.querySelectorAll("h1,h2,h3,p,nav,a,button")].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && !el.classList.contains("skip-link") && (r.right > innerWidth + 1 || r.left < -1);
    }).map(el => el.textContent?.trim().slice(0,100)),
  }));
  expect(geometry.page, JSON.stringify(geometry)).toBeLessThanOrEqual(geometry.viewport + 1);
  expect(geometry.clipped).toEqual([]);
}

test("read, navigate, change theme, preserve it, and return", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A little better,every day.");
  await expect(page.locator(".art-window img")).toHaveJSProperty("naturalWidth", 1122);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: `work/${info.project.name}-daylight.png`, fullPage: true });
  await page.getByRole("link", { name: "Meet the studio" }).click();
  await expect(page).toHaveURL(/#studio$/);
  await expect(page.getByRole("heading", { name: "A studio built around a day." })).toBeInViewport();
  await page.getByRole("button", { name: "Evening theme" }).click();
  await expect(page.getByRole("button", { name: "Evening theme" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "evening");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "evening");
  await page.getByRole("link", { name: "Say hello" }).click();
  await expect(page.getByRole("heading", { name: "Say hello." })).toBeInViewport();
  await expect(page.getByRole("link", { name: "harulostudio@gmail.com" })).toHaveAttribute("href", "mailto:harulostudio@gmail.com");
  await page.getByRole("link", { name: "Back to top" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
  await page.screenshot({ path: `work/${info.project.name}-evening.png`, fullPage: true });
  expect(errors).toEqual([]);
});

test("mobile, short height, text enlargement and text spacing retain content", async ({ page }, info) => {
  await page.goto("/");
  for (const size of [{width:390,height:844},{width:320,height:568},{width:844,height:390},{width:768,height:1024}]) {
    await page.setViewportSize(size);
    await expectReflow(page);
    await page.getByRole("link", {name:"Say hello"}).click();
    await expect(page.getByRole("link", {name:"harulostudio@gmail.com"})).toBeInViewport();
    await page.getByRole("link", {name:"Back to top"}).click();
  }
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:`work/${info.project.name}-mobile.png`,fullPage:true});
  await page.addStyleTag({content:"html { font-size: 200% !important; }"});
  await expectReflow(page);
  await page.addStyleTag({content:"* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }"});
  await expectReflow(page);
  await page.getByRole("link", {name:"Say hello"}).click();
  await page.getByRole("link", {name:"harulostudio@gmail.com"}).scrollIntoViewIfNeeded();
  await expect(page.getByRole("link", {name:"harulostudio@gmail.com"})).toBeInViewport();
});

test("geometry oracle rejects a deliberately faulty control", async ({page}) => {
  await page.goto("/");
  await page.setViewportSize({width:320,height:568});
  await expectReflow(page);
  await page.evaluate(() => { const bad=document.createElement("button");bad.id="fault-fixture";bad.style.width="2000px";bad.textContent="fault injection";document.body.appendChild(bad); });
  await expect(expectReflow(page)).rejects.toThrow();
  await page.evaluate(() => document.getElementById("fault-fixture")?.remove());
  await expectReflow(page);
});

test("both themes pass automated WCAG A/AA checks", async ({page}) => {
  await page.goto("/");
  for (const theme of ["daylight", "evening"]) {
    if(theme === "evening") await page.getByRole("button",{name:"Evening theme"}).click();
    const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
    expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  }
});

test("keyboard navigation exposes the skip link and operable theme", async ({page, browserName}) => {
  await page.goto("/");
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(page.getByRole("link",{name:"Skip to content"})).toBeFocused();
  await expect(page.getByRole("link",{name:"Skip to content"})).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("button",{name:"Evening theme"}).focus();
  await page.keyboard.press("Space");
  await expect(page.locator("html")).toHaveAttribute("data-theme","evening");
  expect(await page.getByRole("button",{name:"Evening theme"}).evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe("none");
});

test("motion pause, reload and device preference control actual animations", async ({page}) => {
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion","running");
  expect(await page.locator(".art-drift").evaluate(el=>getComputedStyle(el).animationName)).toBe("daylight-breathe");
  await page.getByRole("button",{name:"Pause motion"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion","paused");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion","paused");
  await page.getByRole("button",{name:"Resume motion"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion","running");
  await page.emulateMedia({reducedMotion:"reduce"});
  await expect(page.getByRole("button",{name:"Motion reduced"})).toBeDisabled();
  expect(await page.locator(".art-drift").evaluate(el=>getComputedStyle(el).animationName)).toBe("none");
});

test("clipboard failure is truthful and a retry copies the right address", async ({page, context, browserName}) => {
  test.skip(browserName !== "chromium", "Real clipboard permissions are exercised in Chromium.");
  await context.grantPermissions(["clipboard-read","clipboard-write"]);
  await page.goto("/");
  await page.evaluate(() => { (window as unknown as {originalWrite:unknown}).originalWrite=navigator.clipboard.writeText.bind(navigator.clipboard); navigator.clipboard.writeText=async()=>{throw new Error("denied");}; });
  await page.getByRole("button",{name:"Copy email",exact:true}).click();
  await expect(page.getByRole("status")).toContainText("Couldn’t copy");
  await expect(page.getByRole("status")).not.toContainText("Email copied.");
  await page.evaluate(() => { navigator.clipboard.writeText=(window as unknown as {originalWrite:typeof navigator.clipboard.writeText}).originalWrite; });
  await page.getByRole("button",{name:"Copy email",exact:true}).click();
  await expect(page.getByRole("status")).toHaveText("Email copied.");
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe("harulostudio@gmail.com");
  await page.getByRole("button",{name:"Copy email",exact:true}).click();
  await expect(page.getByRole("status")).toHaveText("Email copied.");
});

test("storage denial and missing image do not block essential tasks", async ({page}) => {
  await page.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new Error("denied");};Storage.prototype.setItem=()=>{throw new Error("denied");};});
  await page.route("**/images/daylight.jpg",r=>r.abort());
  await page.goto("/");
  await page.getByRole("button",{name:"Evening theme"}).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme","evening");
  await page.getByRole("link",{name:"Say hello"}).click();
  await expect(page.getByRole("link",{name:"harulostudio@gmail.com"})).toBeInViewport();
  await expectReflow(page);
});

test("forced colors retains readable controls and focus", async ({page, browserName}) => {
  test.skip(browserName !== "chromium", "Forced colors emulation is exercised in Chromium.");
  await page.emulateMedia({forcedColors:"active"});
  await page.goto("/");
  await page.getByRole("button",{name:"Evening theme"}).focus();
  expect(await page.getByRole("button",{name:"Evening theme"}).evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme","evening");
  await expectReflow(page);
});

test("essential copy and contact work without JavaScript", async ({browser}) => {
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto(process.env.HARULO_TEST_URL || "http://127.0.0.1:8791");
  await expect(page.getByRole("heading",{level:1})).toBeVisible();
  await page.getByRole("link",{name:"Say hello"}).click();
  await expect(page.getByRole("link",{name:"harulostudio@gmail.com"})).toHaveAttribute("href","mailto:harulostudio@gmail.com");
  await context.close();
});
