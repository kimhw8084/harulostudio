import { test, expect } from "@playwright/test";
import {
  liveCatalog,
  publicProducts,
  productReleases,
  filterProducts,
  filterReleases,
  paginate,
  validateCatalog,
  pageHref,
} from "../lib/publishing/catalog";
import { demoCatalog, makeGrowthCatalog } from "../lib/publishing/fixtures";
import { productMetadata, jsonLd } from "../lib/publishing/metadata";

test("verified content boundary rejects fiction and private states", () => {
  expect(validateCatalog(liveCatalog)).toEqual([]);
  expect(validateCatalog(demoCatalog)).toEqual([]);
  const contaminated = { ...demoCatalog, edition: "live" as const };
  expect(
    validateCatalog(contaminated).some((e) => e.includes("Synthetic")),
  ).toBe(true);
  expect(publicProducts(contaminated)).toEqual([]);
  expect(productReleases(contaminated)).toEqual([]);
  const internal = {
    ...demoCatalog,
    products: demoCatalog.products.map((p) => ({
      ...p,
      visibility: "internal" as const,
    })),
  };
  expect(publicProducts(internal)).toEqual([]);
  expect(productReleases(internal)).toEqual([]);
});
test("one, five and twenty editions with hundreds of releases paginate predictably", () => {
  for (const count of [1, 5, 20]) {
    const catalog = makeGrowthCatalog(count);
    expect(validateCatalog(catalog)).toEqual([]);
    expect(publicProducts(catalog)).toHaveLength(count);
    expect(productReleases(catalog)).toHaveLength(240);
    const page = paginate(productReleases(catalog), { page: "999" });
    expect(page.page).toBe(20);
    expect(page.items).toHaveLength(12);
    expect(paginate(productReleases(catalog), { page: "-4" }).page).toBe(1);
  }
  const catalog = makeGrowthCatalog(20);
  expect(paginate(publicProducts(catalog), { page: "2" }).items).toHaveLength(
    8,
  );
});
test("combined product and release filters produce relevant results", () => {
  expect(
    filterProducts(demoCatalog.products, {
      platform: "Windows",
      q: "audio",
    }).map((p) => p.id),
  ).toEqual(["sori"]);
  expect(
    filterProducts(demoCatalog.products, { status: "preview" }).map(
      (p) => p.id,
    ),
  ).toEqual(["morrow"]);
  expect(
    filterReleases(demoCatalog, {
      product: "sori",
      year: "2036",
      type: "maintenance",
      platform: "Windows",
      q: "4.8.2",
    }).map((r) => r.version),
  ).toEqual(["4.8.2"]);
  expect(filterReleases(demoCatalog, { q: "does not exist" })).toEqual([]);
  expect(pageHref("/releases", { product: "sori", year: "2036" }, 2)).toBe(
    "/releases?product=sori&year=2036&page=2",
  );
});
test("record validation catches orphan releases, duplicate slugs and future claims", () => {
  const bad = {
    ...demoCatalog,
    products: [...demoCatalog.products, demoCatalog.products[0]],
    releases: [
      {
        ...demoCatalog.releases[0],
        productId: "missing",
        publishedAt: "2099-01-01",
      },
    ],
  };
  const errors = validateCatalog(bad);
  expect(errors.some((e) => e.includes("Duplicate"))).toBe(true);
  expect(errors.some((e) => e.includes("slug"))).toBe(true);
  expect(errors.some((e) => e.includes("Unknown release"))).toBe(true);
  expect(errors.some((e) => e.includes("future"))).toBe(true);
});
test("product metadata follows the record and JSON-LD escapes markup", () => {
  for (const p of demoCatalog.products.slice(0, 2)) {
    const meta = productMetadata(p);
    expect(meta.title).toBe(p.name);
    expect(meta.description).toBe(p.tagline);
    expect(meta.alternates?.canonical).toBe(
      `https://harulostudio.com/software/${p.slug}`,
    );
    expect(meta.openGraph?.images).toEqual([]);
  }
  expect(jsonLd({ text: "</script>" })).not.toContain("</script>");
});
