import { expect, test } from "@playwright/test";
import { showcaseCatalog } from "@/lib/publishing/showcase";

test.describe("showcase provenance boundary", () => {
  test("showcase records carry no release, support, press, or download claims", () => {
    expect(showcaseCatalog.edition).toBe("showcase");
    expect(showcaseCatalog.products).toHaveLength(5);
    expect(showcaseCatalog.products.every((product) => product.provenance === "showcase")).toBe(true);
    expect(showcaseCatalog.releases).toHaveLength(0);
    expect(showcaseCatalog.supportArticles).toHaveLength(0);
    expect(showcaseCatalog.pressItems).toHaveLength(0);
    expect(showcaseCatalog.products.every((product) => !product.downloads?.length)).toBe(true);
  });

  test("showcase products are excluded from sitemap and structured data", async ({ page }) => {
    const sitemap = await page.request.get("/sitemap.xml");
    expect(await sitemap.text()).not.toMatch(/sori|namu|goyo|haru-weather|dami/i);

    await page.goto("/software");
    const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(structuredData.join("\n")).not.toMatch(/Sori|Namu|Goyo|Haru Weather|Dami/);
  });

  test("showcase detail does not imply a release, download, or publisher claim", async ({ page }) => {
    await page.goto("/software/sori");
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/Interactive concept/i);
    expect(body).toMatch(/not released software/i);
    expect(body).not.toMatch(/Latest version|Release channels|Designed, built and published by Harulo Studio|Download details/i);
  });
});
