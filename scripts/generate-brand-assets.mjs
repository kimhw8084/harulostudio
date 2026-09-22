import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { HARULO, markSvg } from "../lib/brand/geometry.ts";

// Generated deliverables only. Author geometry in lib/brand/geometry.ts.
const root = new URL("../public/", import.meta.url);
const dir = new URL("brand/", root);
await mkdir(dir, { recursive: true });
const svg = (body, viewBox = HARULO.viewBox, title = "Harulo Studio") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><title>${title}</title>${body}</svg>`;
const font = (await readFile(new URL("fonts/syne-latin.woff2", root))).toString(
  "base64",
);
const style = `<style>@font-face{font-family:HaruloWordmark;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:400 800}text{font-family:HaruloWordmark,Arial,sans-serif}</style>`;
const assets = {
  "harulo-master.svg": svg(markSvg("#000000")),
  "harulo-reversed.svg": svg(markSvg("#ffffff")),
  "harulo-cobalt-ember.svg": svg(markSvg("#123DFF", "#FF5C35")),
  "harulo-publisher.svg": svg(
    `${style}${markSvg("#101322")}<text x="98" y="47" fill="#101322" font-size="30" font-weight="700" letter-spacing="-1.2">HARULO STUDIO</text><text x="99" y="66" fill="#101322" font-size="10" font-weight="500" letter-spacing="1.2">INDEPENDENT SOFTWARE PUBLISHER</text>`,
    "0 0 450 100",
  ),
  "harulo-vertical.svg": svg(
    `${style}<g transform="translate(25 0) scale(1.5)">${markSvg("#101322")}</g><text x="100" y="160" text-anchor="middle" fill="#101322" font-size="30" font-weight="700" letter-spacing="-1.2">HARULO</text><text x="100" y="183" text-anchor="middle" fill="#101322" font-size="12" font-weight="500" letter-spacing="4">STUDIO</text>`,
    "0 0 200 215",
  ),
};
for (const [name, content] of Object.entries(assets))
  await writeFile(new URL(name, dir), content + "\n");
await writeFile(
  new URL("favicon.svg", root),
  svg(
    `<style>svg{color:#123DFF;--ember:#FF5C35}@media(prefers-color-scheme:dark){svg{color:#6F86FF;--ember:#FF7152}}</style>${markSvg("currentColor", "var(--ember)")}`,
  ) + "\n",
);

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const size of [16, 20, 24, 32, 48, 64, 128, 256, 512]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<style>html,body{margin:0;background:transparent}svg{display:block;width:100vw;height:100vh}</style>${assets["harulo-master.svg"]}`,
    );
    await page.screenshot({
      path: fileURLToPath(new URL(`harulo-${size}.png`, dir)),
      omitBackground: true,
    });
  }
  for (const size of [180, 192]) {
    await page.setViewportSize({ width: size, height: size });
    await page.screenshot({
      path: fileURLToPath(new URL(`harulo-${size}.png`, dir)),
      omitBackground: true,
    });
  }
  const social = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 1200, height: 630 } });
  await social.setContent(`<style>html,body{margin:0;width:1200px;height:630px;background:#F3F5FF;color:#101322;font-family:Arial,sans-serif}main{height:100%;display:grid;grid-template-columns:260px 1fr;align-items:center;padding:0 84px;box-sizing:border-box;gap:64px}svg{width:230px;height:230px}p{margin:0;font-size:22px;letter-spacing:.08em;text-transform:uppercase;color:#123DFF}h1{margin:16px 0 0;font-size:72px;line-height:.95;letter-spacing:-.06em}span{display:block;margin-top:28px;font-size:18px;letter-spacing:.08em;color:#505979}</style><main>${assets["harulo-cobalt-ember.svg"]}<div><p>Independent software publisher</p><h1>Software that gives a little of the day back.</h1><span>HARULO STUDIO / 하루로</span></div></main>`);
  await social.screenshot({ path: fileURLToPath(new URL("og.png", root)) });
  await social.close();
} finally {
  await browser.close();
}
console.log(
  "Generated vector lockups, exact-geometry icons, a 1200×630 social image, and PNG sizes from the canonical source.",
);
