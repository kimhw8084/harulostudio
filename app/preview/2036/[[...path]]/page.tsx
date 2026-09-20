import { notFound } from "next/navigation";
import Link from "@/components/site-link";
import { HaruloSite } from "@/components/harulo-site";
import {
  CatalogView,
  ReleasesView,
  ProductView,
  ReleaseView,
  SupportView,
  SupportArticleView,
} from "@/components/publishing-views";
import { productBySlug, productReleases } from "@/lib/publishing/catalog";
import type { Query } from "@/lib/publishing/types";

export const metadata = {
  title: "Fictional 2036 design edition",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: { images: [] },
  twitter: { images: [] },
};
export const dynamic = "force-dynamic";
export default async function Preview({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Query>;
}) {
  // A production request must terminate before importing any fictional content.
  if (process.env.NODE_ENV !== "development") notFound();
  const { demoCatalog, makeGrowthCatalog } = await import(
    "@/lib/publishing/fixtures"
  );
  const segments = (await params).path || [];
  const query = await searchParams;
  const growth = segments[0] === "growth";
  const path = growth ? segments.slice(1) : segments;
  const catalog = growth ? makeGrowthCatalog(20) : demoCatalog;
  const prefix = growth ? "/preview/2036/growth" : "/preview/2036";
  let view: React.ReactNode;
  if (!path.length) view = <HaruloSite catalog={catalog} prefix={prefix} />;
  else if (path[0] === "software" && path.length === 1)
    view = <CatalogView catalog={catalog} query={query} prefix={prefix} />;
  else if (path[0] === "software" && path.length === 2) {
    const product = productBySlug(catalog, path[1]);
    if (!product) notFound();
    view = <ProductView catalog={catalog} product={product} prefix={prefix} />;
  } else if (path[0] === "releases" && path.length === 1)
    view = <ReleasesView catalog={catalog} query={query} prefix={prefix} />;
  else if (path[0] === "releases" && path.length === 3) {
    const product = productBySlug(catalog, path[1]);
    const release =
      product &&
      productReleases(catalog, product.id).find((r) => r.version === path[2]);
    if (!product || !release) notFound();
    view = (
      <ReleaseView
        catalog={catalog}
        product={product}
        release={release}
        prefix={prefix}
      />
    );
  } else if (path[0] === "support" && path.length === 1)
    view = <SupportView catalog={catalog} prefix={prefix} />;
  else if (path[0] === "support" && path.length === 2) {
    const product = productBySlug(catalog, path[1]);
    if (!product) notFound();
    view = <SupportView catalog={catalog} product={product} prefix={prefix} />;
  } else if (path[0] === "support" && path.length === 3) {
    const product = productBySlug(catalog, path[1]);
    const article =
      product &&
      catalog.supportArticles.find(
        (a) => a.productId === product.id && a.slug === path[2],
      );
    if (!product || !article) notFound();
    view = (
      <SupportArticleView product={product} article={article} prefix={prefix} />
    );
  } else notFound();
  return (
    <>
      <aside className="demo-banner" aria-label="Fictional design edition">
        <div>
          <p>
            <strong>Design edition · 2036</strong>
            <br />
            Fictional products and releases. Development preview only.
          </p>
          <nav className="demo-nav" aria-label="Design edition navigation">
            <Link href={prefix}>Home</Link>
            <Link href={`${prefix}/software`}>Software</Link>
            <Link href={`${prefix}/releases`}>Releases</Link>
            <Link href={`${prefix}/support`}>Support</Link>
            <Link href="/preview/2036/growth/software">20-product test</Link>
            <Link href="/preview/identity-lab">Identity Lab</Link>
            <Link href="/">Current Harulo</Link>
          </nav>
        </div>
      </aside>
      {view}
    </>
  );
}
