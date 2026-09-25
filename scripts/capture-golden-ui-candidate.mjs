import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdir, writeFile, rename, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const root = path.resolve(process.env.HARULO_CAPTURE_DIR || "work/golden-ui-candidate");
const screenshots = path.join(root, "screenshots");
const motion = path.join(root, "motion");
const base = process.env.HARULO_CAPTURE_URL || "http://127.0.0.1:8788";
const sha = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const treeSha = execFileSync("git", ["rev-parse", "HEAD^{tree}"], { encoding: "utf8" }).trim();
const dirty = execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], { encoding: "utf8" }).trim();
if (dirty && !process.env.HARULO_ALLOW_DIRTY_CAPTURE) throw new Error("Source is not frozen; commit changes before generating candidate evidence.");
const branch = execFileSync("git", ["branch", "--show-current"], { encoding: "utf8" }).trim();
const packageLockSha256 = createHash("sha256").update(await readFile("package-lock.json")).digest("hex");
const sourceFiles = execFileSync("git", ["diff", "--name-only", "a9cd81abb2cb4b2444ac5493f7d4b785432127bf..HEAD"], { encoding: "utf8" }).trim().split("\n").filter(Boolean);
const candidateId = `${sha.slice(0, 12)}-${new Date().toISOString().replace(/[:.]/g, "-")}`;
const manifest = { candidateId, startingSha: "a9cd81abb2cb4b2444ac5493f7d4b785432127bf", sourceSha: sha, treeSha, packageLockSha256, sourceFiles, branch, browser: "chromium", browserVersion: "", generatedAt: new Date().toISOString(), captures: [], recordings: [] };
const diagnostics = { consoleErrors: [], expectedResponses: [], failedRequests: [], failedResponses: [], overflow: [], captureErrors: [] };

await mkdir(screenshots, { recursive: true });
await mkdir(motion, { recursive: true });
const browser = await chromium.launch({ headless: true });
manifest.browserVersion = browser.version();

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };
const tablet = { width: 900, height: 1100 };
const short = { width: 1280, height: 640 };
const narrow = { width: 320, height: 568 };
const captures = [
  ["home-light-desktop", "/", desktop, "light"],
  ["home-dark-desktop", "/", desktop, "dark"],
  ["home-light-mobile", "/", mobile, "light"],
  ["home-dark-mobile", "/", mobile, "dark"],
  ["home-tablet", "/", tablet, "light"],
  ["home-short-desktop", "/", short, "light"],
  ["home-genesis-rest", "/", desktop, "light", "rest"],
  ["home-genesis-open", "/", desktop, "light", "genesisOpen"],
  ["home-genesis-alternate", "/", desktop, "light", "genesisAlternate"],
  ["home-genesis-open-mobile", "/", mobile, "light", "genesisOpen"],
  ["home-genesis-open-320", "/", narrow, "light", "genesisOpen"],
  ["home-genesis-dark-rest", "/", desktop, "dark", "rest"],
  ["home-genesis-dark-open", "/", desktop, "dark", "genesisOpen"],
  ["software-desktop", "/software", desktop, "light"],
  ["software-mobile", "/software", mobile, "light"],
  ["software-dark", "/software", desktop, "dark"],
];
for (const slug of ["sori", "namu", "goyo", "haru-weather", "dami"]) {
  captures.push([`${slug}-desktop`, `/software/${slug}`, desktop, "light"]);
  captures.push([`${slug}-mobile`, `/software/${slug}`, mobile, "light"]);
  captures.push([`${slug}-dark`, `/software/${slug}`, desktop, "dark"]);
}
for (const state of ["closed", "keyboard", "accessibility", "data", "mobile-open"]) {
  captures.push([`sori-xray-${state}`, "/software/sori", state === "mobile-open" ? mobile : desktop, "light", `xray-${state}`]);
}
for (const route of ["studio", "press", "privacy"]) {
  captures.push([`${route}-desktop`, `/${route}`, desktop, "light"]);
  captures.push([`${route}-mobile`, `/${route}`, mobile, "light"]);
  captures.push([`${route}-dark`, `/${route}`, desktop, "dark"]);
}
captures.push(["404-desktop", "/visual-route-missing", desktop, "light"]);
captures.push(["404-mobile", "/visual-route-missing", mobile, "light"]);
captures.push(["final-return-start", "/", desktop, "light", "finalReturnStart"]);
captures.push(["final-return-end", "/", desktop, "light", "finalReturnEnd"]);
captures.push(["home-final-signature", "/", desktop, "light", "finalReturnEnd"]);
captures.push(["ordinary-footer", "/privacy", desktop, "light", "footer"]);
captures.push(["mobile-footer", "/privacy", mobile, "light", "footer"]);
captures.push(["home-holdout-1024", "/", { width: 1024, height: 640 }, "light"]);
captures.push(["home-holdout-412", "/", { width: 412, height: 915 }, "light"]);
captures.push(["home-holdout-1366", "/", { width: 1366, height: 768 }, "light"]);
captures.push(["namu-dense", "/software/namu", desktop, "light", "namuDense"]);
captures.push(["weather-evening-rain", "/software/haru-weather", desktop, "light", "weatherRain"]);
captures.push(["dami-negative", "/software/dami", desktop, "light", "damiNegative"]);
captures.push(["xray-keyboard-mutated", "/software/sori", desktop, "light", "xrayMutated"]);
captures.push(["large-text-home", "/", mobile, "light", "largeTextGenesis"]);
captures.push(["large-text-dami", "/software/dami", mobile, "light", "largeText"]);
captures.push(["forced-colors-genesis", "/", mobile, "light", "forcedGenesis"]);
captures.push(["forced-colors-sori", "/software/sori", mobile, "light", "forcedSori"]);
captures.push(["forced-colors-xray", "/software/sori", mobile, "light", "forcedXray"]);
captures.push(["forced-colors-menu", "/", mobile, "light", "forcedMenu"]);

async function prepare(page, state) {
  if (state.action.startsWith("finalReturn")) await page.addInitScript(() => { window.__HARULO_TEST_HOLD_RETURN__ = true; });
  await page.goto(base + state.route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  if (state.action.startsWith("largeText")) await page.evaluate(() => { document.documentElement.style.fontSize = "32px"; });
  if (state.action === "genesisOpen" || state.action === "genesisAlternate") {
    await page.locator(".genesis-toggle").click();
    await page.locator('.genesis-stage[data-phase="open"]').waitFor();
    if (state.action === "genesisAlternate") await page.getByRole("tab", { name: /Namu/ }).click();
  }
  if (state.action?.startsWith("xray-") && state.action !== "xray-closed") {
    await page.locator(".xray-inspection summary").click();
    if (state.action === "xray-keyboard") await page.getByRole("tab", { name: "Keyboard" }).click();
    if (state.action === "xray-accessibility") await page.getByRole("tab", { name: "Accessibility" }).click();
    if (state.action === "xray-data") await page.getByRole("tab", { name: "Data boundary" }).click();
  }
  if (state.action === "xrayMutated" || state.action === "forcedXray") {
    await page.locator(".xray-inspection summary").click();
    await page.getByRole("tab", { name: "Keyboard" }).click();
    if (state.action === "xrayMutated") await page.getByRole("button", { name: "Mute Music" }).click();
  }
  if (state.action === "namuDense") {
    for (let i = 0; i < 5; i++) {
      await page.getByRole("textbox", { name: "New note title" }).fill(`Sample note ${i + 1}`);
      await page.getByRole("button", { name: "Create note" }).click();
    }
  }
  if (state.action === "weatherRain") await page.getByRole("button", { name: "Evening" }).click();
  if (state.action === "damiNegative") await page.getByRole("spinbutton", { name: "Editable allocation in US dollars" }).fill("2400");
  if (state.action === "largeTextGenesis" || state.action === "forcedGenesis") {
    await page.locator(".genesis-toggle").click();
    await page.locator('.genesis-stage[data-phase="open"]').waitFor();
  }
  if (state.action === "forcedMenu") await page.getByRole("button", { name: "Menu" }).click();
  if (state.action.startsWith("finalReturn")) {
    await page.locator(".home-final-return").scrollIntoViewIfNeeded();
    if (state.action === "finalReturnStart") {
      await page.locator('.home-final-return[data-progress="0.000"] [data-harulo-pieces="4"][data-resting="false"]').waitFor();
    } else {
      await page.evaluate(() => window.dispatchEvent(new Event("harulo:test-return-release")));
      await page.locator('.home-final-return[data-complete="true"] [data-harulo-pieces="4"][data-resting="true"]').waitFor();
    }
  }
  if (state.action === "footer") await page.locator(".site-footer").scrollIntoViewIfNeeded();
}

for (const [name, route, viewport, theme, action] of captures) {
  const state = { name, route, viewport, theme, action: action || "default" };
  const motionPreference = state.action.startsWith("finalReturn") ? "no-preference" : "reduce";
  const context = await browser.newContext({ viewport, colorScheme: theme, reducedMotion: motionPreference, forcedColors: state.action.startsWith("forced") ? "active" : "none", deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on("console", message => {
    if (message.type() !== "error") return;
    const entry = { name, text: message.text() };
    if (name.startsWith("404-") && message.text().includes("status of 404")) diagnostics.expectedResponses.push(entry);
    else diagnostics.consoleErrors.push(entry);
  });
  page.on("pageerror", error => diagnostics.consoleErrors.push({ name, text: error.message }));
  page.on("requestfailed", request => diagnostics.failedRequests.push({ name, url: request.url(), reason: request.failure()?.errorText }));
  page.on("response", response => {
    if (response.status() >= 400 && !(name.startsWith("404-") && response.status() === 404)) diagnostics.failedResponses.push({ name, url: response.url(), status: response.status() });
  });
  try {
    await prepare(page, state);
    const geometry = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth, bodyBackground: getComputedStyle(document.body).backgroundColor, theme: document.documentElement.dataset.theme }));
    if (geometry.scrollWidth > geometry.innerWidth + 1) diagnostics.overflow.push({ name, ...geometry });
    const filename = `${name}.png`;
    const target = ["rest", "genesisOpen", "genesisAlternate", "forcedGenesis"].includes(state.action) ? page.locator(".genesis-stage") : state.action.startsWith("finalReturn") ? page.locator(".home-final-return") : state.action === "footer" ? page.locator(".site-footer") : state.action === "forcedMenu" ? page.getByRole("dialog") : null;
    if (target) await target.screenshot({ path: path.join(screenshots, filename), animations: "disabled" });
    else await page.screenshot({ path: path.join(screenshots, filename), fullPage: true, animations: "disabled" });
    manifest.captures.push({ ...state, filename: `screenshots/${filename}`, timestamp: new Date().toISOString(), motionPreference, forcedColors: state.action.startsWith("forced"), geometry });
  } catch (error) {
    diagnostics.captureErrors.push({ name, message: String(error) });
  } finally {
    await context.close();
  }
}

async function record(name, viewport, route, action) {
  const context = await browser.newContext({ viewport, colorScheme: "light", reducedMotion: "no-preference", recordVideo: { dir: motion, size: viewport } });
  const page = await context.newPage();
  page.on("console", message => { if (message.type() === "error") diagnostics.consoleErrors.push({ name, text: message.text() }); });
  page.on("pageerror", error => diagnostics.consoleErrors.push({ name, text: error.message }));
  try {
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await action(page);
    await page.waitForTimeout(650);
  } catch (error) {
    diagnostics.captureErrors.push({ name, message: String(error) });
  } finally {
    const video = page.video();
    await context.close();
    if (video) {
      const filename = `${name}.webm`;
      await rename(await video.path(), path.join(motion, filename));
      manifest.recordings.push({ name, route, viewport, theme: "light", motionPreference: "no-preference", filename: `motion/${filename}`, timestamp: new Date().toISOString() });
    }
  }
}

await record("genesis-open", desktop, "/", async page => {
  await page.locator(".genesis-toggle").click();
  await page.locator('.genesis-stage[data-phase="open"]').waitFor();
});
await record("genesis-switch", desktop, "/", async page => {
  await page.locator(".genesis-toggle").click();
  await page.locator('.genesis-stage[data-phase="open"]').waitFor();
  await page.getByRole("tab", { name: /Namu/ }).click();
});
await record("genesis-close", desktop, "/", async page => {
  await page.locator(".genesis-toggle").click();
  await page.locator('.genesis-stage[data-phase="open"]').waitFor();
  await page.locator(".genesis-toggle").click();
  await page.locator('.genesis-stage[data-phase="resting"]').waitFor();
});
await record("genesis-interruption", desktop, "/", async page => {
  await page.locator(".genesis-toggle").click();
  await page.locator(".genesis-toggle").click();
  await page.locator(".genesis-toggle").click();
  await page.locator('.genesis-stage[data-phase="open"]').waitFor();
});
await record("mobile-navigation", mobile, "/", async page => {
  await page.getByRole("button", { name: "Menu" }).click();
  await page.waitForTimeout(250);
  await page.keyboard.press("Escape");
});
await record("product-continuity", desktop, "/software", async page => {
  await page.locator('.edition-card[data-publication="sori"] a').click();
  await page.waitForURL("**/software/sori");
});
await record("theme-change", desktop, "/", async page => {
  await page.locator(".theme-button").click();
});
await record("home-final-return", desktop, "/", async page => {
  await page.locator(".home-final-return").scrollIntoViewIfNeeded();
  await page.locator('.home-final-return[data-complete="true"]').waitFor();
});

await browser.close();
await writeFile(path.join(root, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
await writeFile(path.join(root, "diagnostics.json"), JSON.stringify(diagnostics, null, 2) + "\n");
const cards = manifest.captures.map(({ name, filename, route, viewport, theme, action }) => `<a href="${filename}"><img loading="lazy" src="${filename}" alt="${name}"><strong>${name}</strong><small>${route} · ${viewport.width}×${viewport.height} · ${theme} · ${action}</small></a>`).join("\n");
const videos = manifest.recordings.map(({ name, filename }) => `<li><a href="${filename}">${name}</a></li>`).join("\n");
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Harulo Golden UI candidate ${candidateId}</title><style>body{margin:0;background:#101322;color:#F3F5FF;font:16px/1.5 system-ui;padding:24px}h1{font-size:28px}p{color:#B5BEDD}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:18px}a{color:inherit;text-decoration:none;background:#222844;padding:10px;display:grid;gap:8px;align-content:start}img{width:100%;height:240px;object-fit:contain;object-position:top;background:#090B17}small{color:#B5BEDD}</style><h1>Harulo Golden UI candidate</h1><p>${candidateId} · ${sha} · ${manifest.captures.length} captures · ${manifest.recordings.length} recordings</p><h2>Motion</h2><ul>${videos}</ul><h2>Screenshots</h2><div class="grid">${cards}</div></html>`;
await writeFile(path.join(root, "contact-sheet.html"), html);
console.log(JSON.stringify({ root, captures: manifest.captures.length, recordings: manifest.recordings.length, diagnostics }, null, 2));
if (diagnostics.captureErrors.length || diagnostics.overflow.length || diagnostics.consoleErrors.length || diagnostics.failedRequests.length || diagnostics.failedResponses.length) process.exitCode = 1;
