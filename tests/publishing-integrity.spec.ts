import { expect, test } from "@playwright/test";
import { getPublicPublications, resolvePublication } from "@/lib/publishing/catalog";
import { showcaseProducts } from "@/lib/publishing/showcase";
import type { PublisherCatalog, VerifiedProduct } from "@/lib/publishing/types";
import { publicSitemapPaths } from "@/app/sitemap";
import { publicNavigation, productReleases, hasVerifiedReleases, hasVerifiedSupport, hasProductSupport } from "@/lib/publishing/catalog";
import { softwareSchema } from "@/lib/publishing/metadata";

test("test-only verified fixture resolves through the full publication lifecycle without entering public records", () => {
  const product = { ...showcaseProducts[0], provenance: "verified" as const, version: "1.0.0", firstReleasedAt: "2026-01-01", latestReleasedAt: "2026-01-01", privacy: { updatedAt: "2026-01-01", summary: "Fixture", collected: [], notCollected: ["Nothing"], retention: "None", deletion: "On request", services: [], history: [] } } as VerifiedProduct;
  const fixture: PublisherCatalog = {
    edition: "live",
    asOf: "2026-09-21",
    products: [product],
    releases: [{ id: "fixture-release", productId: product.id, version: "1.0.0", publishedAt: "2026-01-01", provenance: "verified", title: "First publication", summary: "Fixture release", kind: "major", channel: "stable", platforms: product.platforms, improvements: [], fixes: [], securityNotes: [], compatibility: [], knownIssues: [], downloads: [] }],
    supportArticles: [{ id: "fixture-support", productId: product.id, slug: "start", title: "Start", category: "getting-started", updatedAt: "2026-01-01", provenance: "verified", sections: [] }],
    pressItems: [{ id: "fixture-press", slug: "fixture", title: "Fixture", publishedAt: "2026-01-01", provenance: "verified", productId: product.id, summary: "Fixture", paragraphs: [], assets: [] }],
  };
  const resolved = resolvePublication(product.slug, { live: fixture, showcase: { ...fixture, edition: "showcase", products: showcaseProducts } });
  expect(resolved?.kind).toBe("verified");
  expect(resolved?.product.provenance).toBe("verified");
  expect(getPublicPublications({ live: fixture, showcase: { ...fixture, edition: "showcase", products: showcaseProducts } }).verified).toHaveLength(1);
  expect(resolvePublication("sori")?.kind).toBe("showcase");
  expect(publicNavigation(fixture).map((item) => item.href)).toEqual([
    "/software",
    "/studio",
    "/press",
    "/releases",
    "/support",
  ]);
  expect(productReleases(fixture, product.id)).toHaveLength(1);
  expect(softwareSchema(product)?.["@type"]).toBe("SoftwareApplication");
  expect(publicSitemapPaths(fixture)).toEqual(expect.arrayContaining([
    `/software/${product.slug}`,
    `/software/${product.slug}/privacy`,
    `/releases/${product.slug}/1.0.0`,
    `/support/${product.slug}/start`,
    "/releases",
    "/support",
    "/press/fixture",
  ]));
});

test("internal verified records cannot activate public release or support navigation", () => {
  const internal = { ...showcaseProducts[1], id: "internal-namu", slug: "internal-namu", provenance: "verified" as const, visibility: "internal" as const } as VerifiedProduct;
  const catalog: PublisherCatalog = {
    edition: "live",
    asOf: "2026-09-21",
    products: [internal],
    releases: [{ id: "internal-release", productId: internal.id, version: "1.0.0", publishedAt: "2026-01-01", provenance: "verified", title: "Internal", summary: "Internal", kind: "major", channel: "stable", platforms: internal.platforms, improvements: [], fixes: [], securityNotes: [], compatibility: [], knownIssues: [], downloads: [] }],
    supportArticles: [{ id: "internal-support", productId: internal.id, slug: "start", title: "Internal", category: "getting-started", updatedAt: "2026-01-01", provenance: "verified", sections: [] }],
    pressItems: [],
  };
  expect(hasVerifiedReleases(catalog)).toBe(false);
  expect(hasVerifiedSupport(catalog)).toBe(false);
  expect(publicNavigation(catalog).map((item) => item.href)).toEqual(["/software", "/studio", "/press"]);
  expect(hasProductSupport(catalog, internal.id)).toBe(false);
});
