import type { MetadataRoute } from "next";
import { studio } from "@/lib/site-content";
import { liveCatalog, productReleases, publicProducts } from "@/lib/publishing/catalog";
import type { PublisherCatalog } from "@/lib/publishing/types";

/** Only verified public destinations belong in the production sitemap. */
export function publicSitemapPaths(catalog: PublisherCatalog): string[] {
  const products = publicProducts(catalog).filter((product) => product.provenance === "verified");
  const paths = ["", "/software", "/studio", "/press", "/privacy"];
  for (const product of products) {
    paths.push(`/software/${product.slug}`);
    if (product.privacy) paths.push(`/software/${product.slug}/privacy`);
    if (product.history?.length) paths.push(`/software/${product.slug}/history`);
    for (const release of productReleases(catalog, product.id)) {
      paths.push(`/releases/${product.slug}/${release.version}`);
    }
    for (const article of catalog.supportArticles.filter((item) => item.productId === product.id && item.provenance === "verified")) {
      paths.push(`/support/${product.slug}/${article.slug}`);
    }
  }
  for (const item of catalog.pressItems.filter((entry) => entry.provenance === "verified")) {
    paths.push(`/press/${item.slug}`);
  }
  if (catalog.releases.some((release) => release.provenance === "verified")) paths.push("/releases");
  if (catalog.supportArticles.some((article) => article.provenance === "verified")) paths.push("/support");
  if (products.some((product) => ["archived", "discontinued"].includes(product.status))) paths.push("/archive");
  if (catalog.milestones?.some((milestone) => milestone.provenance === "verified")) paths.push("/history");
  return [...new Set(paths)];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return publicSitemapPaths(liveCatalog).map((path) => ({
    url: `${studio.url}${path}`,
  }));
}
