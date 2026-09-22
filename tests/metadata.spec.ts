import { expect, test } from "@playwright/test";

test("production metadata, headers and assets are real responses", async ({ page }) => {
  const home = await page.request.get("/");
  expect(home.status()).toBe(200);
  expect(home.headers()["x-content-type-options"]).toBe("nosniff");
  expect(home.headers()["content-security-policy"]).toContain("frame-ancestors 'self'");
  const html = await home.text();
  expect(html).toContain("/og.png");

  const og = await page.request.get("/og.png");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
  expect((await og.body()).byteLength).toBeGreaterThan(10_000);
  for (const icon of ["/brand/harulo-180.png", "/brand/harulo-192.png", "/brand/harulo-512.png"]) {
    const response = await page.request.get(icon);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  }
  expect((await (await page.request.get("/sitemap.xml")).text())).not.toMatch(/sori|namu|goyo|haru-weather|dami/i);
});
