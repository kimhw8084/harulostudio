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
  "harulo-daylight.svg": svg(markSvg("#f0f769")),
  "harulo-publisher.svg": svg(
    `${style}${markSvg("#171a16")}<text x="98" y="47" fill="#171a16" font-size="30" font-weight="700" letter-spacing="-1.2">HARULO STUDIO</text><text x="99" y="66" fill="#171a16" font-size="10" font-weight="500" letter-spacing="1.2">INDEPENDENT SOFTWARE PUBLISHER</text>`,
    "0 0 450 100",
  ),
  "harulo-vertical.svg": svg(
    `${style}<g transform="translate(25 0) scale(1.5)">${markSvg("#171a16")}</g><text x="100" y="160" text-anchor="middle" fill="#171a16" font-size="30" font-weight="700" letter-spacing="-1.2">HARULO</text><text x="100" y="183" text-anchor="middle" fill="#171a16" font-size="12" font-weight="500" letter-spacing="4">STUDIO</text>`,
    "0 0 200 215",
  ),
};
for (const [name, content] of Object.entries(assets))
  await writeFile(new URL(name, dir), content + "\n");
await writeFile(
  new URL("favicon.svg", root),
  svg(
    `<style>svg{color:#171a16}@media(prefers-color-scheme:dark){svg{color:#f0f769}}</style>${markSvg()}`,
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
} finally {
  await browser.close();
}
console.log(
  "Generated 5 vector lockups, exact-geometry favicon and 9 PNG sizes from the canonical source.",
);
