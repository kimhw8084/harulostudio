import type {
  Product,
  ProductStatus,
  PublisherCatalog,
  Query,
  Release,
} from "./types";

export const publicStatuses: ProductStatus[] = [
  "preview",
  "published",
  "maintained",
  "maintenance",
  "archived",
  "discontinued",
];
export const statusLabels: Record<ProductStatus, string> = {
  exploring: "Exploring",
  development: "In development",
  "private-beta": "Private beta",
  preview: "Preview",
  published: "Available",
  maintained: "Maintained",
  maintenance: "Maintenance",
  archived: "Archived",
  discontinued: "Discontinued",
};

/** The production source of truth. Add only announced, verified products here. */
export const liveCatalog: PublisherCatalog = {
  edition: "live",
  asOf: "2026-09-20",
  products: [],
  releases: [],
  supportArticles: [],
  pressItems: [],
};

export function publicProducts(catalog: PublisherCatalog) {
  return catalog.products.filter(
    (p) =>
      p.visibility === "public" &&
      publicStatuses.includes(p.status) &&
      (catalog.edition === "demo" ||
        catalog.edition === "showcase" ||
        p.provenance === "verified"),
  );
}
export function hasPublicSoftware(catalog: PublisherCatalog) {
  return publicProducts(catalog).length > 0;
}
export function hasVerifiedReleases(catalog: PublisherCatalog) {
  return catalog.releases.some((release) => release.provenance === "verified");
}
export function hasVerifiedSupport(catalog: PublisherCatalog) {
  return catalog.supportArticles.some((article) => article.provenance === "verified");
}
export function hasVerifiedPress(catalog: PublisherCatalog) {
  return catalog.pressItems.some((item) => item.provenance === "verified");
}
export function hasArchive(catalog: PublisherCatalog) {
  return publicProducts(catalog).some((product) => ["archived", "discontinued"].includes(product.status));
}
export function productBySlug(catalog: PublisherCatalog, slug: string) {
  return publicProducts(catalog).find((p) => p.slug === slug);
}
export function productReleases(catalog: PublisherCatalog, productId?: string) {
  const ids = new Set(publicProducts(catalog).map((p) => p.id));
  return catalog.releases
    .filter(
      (r) =>
        ids.has(r.productId) &&
        (!productId || r.productId === productId) &&
        (catalog.edition !== "live" || r.provenance === "verified"),
    )
    .sort(
      (a, b) =>
        b.publishedAt.localeCompare(a.publishedAt) ||
        b.version.localeCompare(a.version),
    );
}
export function queryValue(query: Query, key: string) {
  const v = query[key];
  return typeof v === "string" ? v : "";
}
export function filterProducts(products: Product[], query: Query) {
  const q = queryValue(query, "q").trim().toLowerCase();
  return products.filter(
    (p) =>
      (!q ||
        `${p.name} ${p.koreanName || ""} ${p.category} ${p.tagline}`
          .toLowerCase()
          .includes(q)) &&
      (!queryValue(query, "platform") ||
        p.platforms.includes(
          queryValue(query, "platform") as Product["platforms"][number],
        )) &&
      (!queryValue(query, "status") ||
        p.status === queryValue(query, "status")),
  );
}
export function filterReleases(catalog: PublisherCatalog, query: Query) {
  const q = queryValue(query, "q").trim().toLowerCase();
  return productReleases(catalog).filter(
    (r) =>
      (!queryValue(query, "product") ||
        r.productId === queryValue(query, "product")) &&
      (!queryValue(query, "year") ||
        r.publishedAt.startsWith(queryValue(query, "year"))) &&
      (!queryValue(query, "type") || r.kind === queryValue(query, "type")) &&
      (!queryValue(query, "channel") ||
        r.channel === queryValue(query, "channel")) &&
      (!queryValue(query, "platform") ||
        r.platforms.includes(
          queryValue(query, "platform") as Release["platforms"][number],
        )) &&
      (!q || `${r.version} ${r.title} ${r.summary}`.toLowerCase().includes(q)),
  );
}
export function paginate<T>(items: T[], query: Query, pageSize = 12) {
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(
    pages,
    Math.max(1, Number.parseInt(queryValue(query, "page"), 10) || 1),
  );
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    pages,
    total: items.length,
  };
}
export function pageHref(path: string, query: Query, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query))
    if (typeof value === "string" && value && key !== "page")
      params.set(key, value);
  params.set("page", String(page));
  return `${path}?${params}`;
}
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}
export function releasePath(release: Release, product: Product, prefix = "") {
  return `${prefix}/releases/${product.slug}/${encodeURIComponent(release.version)}`;
}

export function validateCatalog(catalog: PublisherCatalog) {
  const errors: string[] = [];
  for (const [name, records] of Object.entries({
    products: catalog.products,
    releases: catalog.releases,
    support: catalog.supportArticles,
    press: catalog.pressItems,
    milestones: catalog.milestones ?? [],
  })) {
    const ids = new Set<string>();
    for (const record of records) {
      if (ids.has(record.id)) errors.push(`Duplicate ${name} id: ${record.id}`);
      ids.add(record.id);
      if (catalog.edition === "live" && record.provenance !== "verified")
        errors.push(`Synthetic ${name} in live catalog: ${record.id}`);
    }
  }
  const slugs = new Set<string>();
  const ids = new Set(catalog.products.map((p) => p.id));
  for (const p of catalog.products) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || slugs.has(p.slug))
      errors.push(`Invalid/duplicate product slug: ${p.slug}`);
    slugs.add(p.slug);
    if (!p.platforms.length) errors.push(`No platforms: ${p.id}`);
    if (p.status === "published" && (!p.version || !p.firstReleasedAt))
      errors.push(`Missing publication metadata: ${p.id}`);
  }
  const versions = new Set<string>();
  for (const r of catalog.releases) {
    const key = `${r.productId}/${r.version}`;
    if (!ids.has(r.productId)) errors.push(`Unknown release product: ${key}`);
    if (versions.has(key)) errors.push(`Duplicate version: ${key}`);
    versions.add(key);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(r.publishedAt) ||
      r.publishedAt > catalog.asOf
    )
      errors.push(`Invalid/future publication date: ${key}`);
  }
  for (const a of catalog.supportArticles)
    if (!ids.has(a.productId)) errors.push(`Unknown support product: ${a.id}`);
  for (const p of catalog.products) {
    if (p.successorId && !ids.has(p.successorId))
      errors.push(`Unknown successor: ${p.id}`);
    for (const id of p.relatedProductIds ?? [])
      if (!ids.has(id)) errors.push(`Unknown related product: ${p.id}/${id}`);
  }
  for (const item of catalog.pressItems)
    if (item.productId && !ids.has(item.productId))
      errors.push(`Unknown press product: ${item.id}`);
  return errors;
}
