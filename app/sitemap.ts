import type { MetadataRoute } from "next";
import { studio } from "@/lib/site-content";
import {
  liveCatalog,
  publicProducts,
  productReleases,
  releasePath,
} from "@/lib/publishing/catalog";
export default function sitemap(): MetadataRoute.Sitemap {
  const products = publicProducts(liveCatalog);
  return [
    ...[
      "",
      "/software",
      "/releases",
      "/studio",
      "/support",
      "/press",
      "/archive",
      "/history",
    ].map((path) => ({ url: `${studio.url}${path}` })),
    ...products.flatMap((p) => [
      {
        url: `${studio.url}/software/${p.slug}`,
        lastModified: p.latestReleasedAt,
      },
      { url: `${studio.url}/support/${p.slug}` },
    ]),
    ...productReleases(liveCatalog).map((r) => ({
      url: `${studio.url}${releasePath(
        r,
        products.find((p) => p.id === r.productId)!,
      )}`,
      lastModified: r.publishedAt,
    })),
    ...liveCatalog.supportArticles
      .filter(
        (a) =>
          a.provenance === "verified" &&
          products.some((p) => p.id === a.productId),
      )
      .map((a) => ({
        url: `${studio.url}/support/${products.find((p) => p.id === a.productId)!.slug}/${a.slug}`,
        lastModified: a.updatedAt,
      })),
    ...products
      .filter((p) => p.privacy)
      .map((p) => ({
        url: `${studio.url}/software/${p.slug}/privacy`,
        lastModified: p.privacy!.updatedAt,
      })),
    ...liveCatalog.pressItems
      .filter((i) => i.provenance === "verified")
      .map((i) => ({
        url: `${studio.url}/press/${i.slug}`,
        lastModified: i.publishedAt,
      })),
  ];
}
