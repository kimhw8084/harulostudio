import Link from "@/components/site-link";
import type {
  Product,
  PublisherCatalog,
  PressItem,
  Query,
} from "@/lib/publishing/types";
import {
  formatDate,
  productReleases,
  queryValue,
  publicProducts,
} from "@/lib/publishing/catalog";
import { PageIntro, EmptyPublication } from "./publishing-views";
import { StudioStory } from "./harulo-site";
import { ChronoLens, ReleaseRiver } from "./brand/publisher-history";
import { HaruloMark, HaruloLockup } from "./brand/harulo-mark";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function HistoryView({
  catalog,
  prefix = "",
  studio = false,
}: {
  catalog: PublisherCatalog;
  prefix?: string;
  studio?: boolean;
}) {
  const milestones = (catalog.milestones ?? []).filter(
    (m) => catalog.edition === "demo" || m.provenance === "verified",
  );
  return (
    <main id="main" tabIndex={-1} className="history-page">
      {studio && <StudioStory full />}
      <div className="page-width content-page">
        <PageIntro
          eyebrow="The continuing record"
          title="A day. Then another."
          description="A publishing practice is built through what it makes, what it maintains, and what it leaves readable."
        />
        {!milestones.length && (
          <EmptyPublication title="At the beginning.">
            Harulo has no announced product history yet. Future milestones will
            appear here as they happen.
          </EmptyPublication>
        )}
      </div>
      {milestones.length > 0 && (
        <>
          {catalog.edition === "demo" && (
            <ChronoLens catalog={catalog} prefix={prefix} />
          )}
          <ol className="page-width history-record">
            {milestones.map((m) => (
              <li key={m.id} className="news-entry">
                <span className="metadata">
                  {m.year} /{" "}
                  {catalog.edition === "demo"
                    ? "FICTIONAL HISTORY"
                    : "STUDIO RECORD"}
                </span>
                <h2>{m.title}</h2>
                <p>{m.description}</p>
              </li>
            ))}
          </ol>
        </>
      )}
    </main>
  );
}
export function ArchiveView({
  catalog,
  prefix = "",
}: {
  catalog: PublisherCatalog;
  prefix?: string;
}) {
  const products = publicProducts(catalog).filter((p) =>
    ["archived", "discontinued", "maintenance"].includes(p.status),
  );
  return (
    <main id="main" tabIndex={-1} className="page-width content-page">
      <PageIntro
        eyebrow="The permanent archive"
        title="An ending is not an erasure."
        description="Final editions, preserved documentation, and clear paths to what comes next."
      />
      {!products.length ? (
        <EmptyPublication title="No archived publications.">
          When a Harulo product reaches its final edition, its history and
          support status will remain clear.
        </EmptyPublication>
      ) : (
        <div className="archive-entries">
          {products.map((p) => (
            <article className="archive-entry" key={p.id}>
              <HaruloMark />
              <div>
                <span className="metadata">
                  {p.firstReleasedAt?.slice(0, 4)}—
                  {p.latestReleasedAt?.slice(0, 4)} / {p.status.toUpperCase()}
                </span>
                <h2>
                  <Link href={`${prefix}/archive/${p.slug}`}>{p.name} ↗</Link>
                </h2>
                <p>
                  {p.archiveReason ??
                    "This product receives security maintenance. Its documented workflow remains available."}
                </p>
              </div>
              <div>
                <span className="metadata">
                  FINAL / CURRENT VERSION {p.version}
                </span>
                <p>{p.migration}</p>
                <Link
                  className="text-link"
                  href={`${prefix}/support/${p.slug}`}
                >
                  Preserved documentation ↗
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
export function ProductHistoryView({
  catalog,
  product,
  prefix,
}: {
  catalog: PublisherCatalog;
  product: Product;
  prefix: string;
}) {
  return (
    <main id="main" tabIndex={-1} className="page-width content-page">
      <PageIntro
        eyebrow={`${product.name} / Publication history`}
        title="Every edition leaves a trace."
        description={product.description}
      />
      <ReleaseRiver
        releases={productReleases(catalog, product.id)}
        products={[product]}
        prefix={prefix}
      />
      <section className="article">
        <h2>Between versions</h2>
        <p>{product.migration}</p>
        <Link className="text-link" href={`${prefix}/software/${product.slug}`}>
          Current product record ↗
        </Link>
      </section>
    </main>
  );
}
export function NewsView({
  catalog,
  prefix,
  query = {},
}: {
  catalog: PublisherCatalog;
  prefix: string;
  query?: Query;
}) {
  const q = queryValue(query, "q");
  const items = catalog.pressItems
    .filter((p) => catalog.edition === "demo" || p.provenance === "verified")
    .filter((p) =>
      `${p.title} ${p.summary}`.toLowerCase().includes(q.toLowerCase()),
    )
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return (
    <main id="main" tabIndex={-1} className="page-width content-page">
      <PageIntro
        eyebrow="From the publisher"
        title="The publication desk."
        description="Launches, major editions, platform changes and permanent archive notices. Harulo is the source; no outside endorsement is implied."
      />
      <form method="get" action={`${prefix}/press`} className="filters">
        <label>
          Find an announcement
          <Input
            name="q"
            defaultValue={q}
            placeholder="Product or publication"
          />
        </label>
        <Button>Search announcements</Button>
        <Link href={`${prefix}/press`}>Reset</Link>
      </form>
      <p className="resource-note">
        Fictional publisher announcements · {items.length} records
      </p>
      {items.map((item) => (
        <article className="news-entry" key={item.id}>
          <time className="metadata" dateTime={item.publishedAt}>
            {formatDate(item.publishedAt)}
          </time>
          <h2>
            <Link href={`${prefix}/press/${item.slug}`}>{item.title} ↗</Link>
          </h2>
          <p>{item.summary}</p>
        </article>
      ))}
      {!items.length && (
        <EmptyPublication title="No announcements match.">
          Try a different product name.
        </EmptyPublication>
      )}
      <section className="detail-section">
        <h2>The Harulo media kit.</h2>
        <div className="press-assets">
          <div className="press-asset">
            <HaruloMark />
            <a href="/brand/harulo-cobalt-ember.svg" download>
              Full-color master SVG ↗
            </a>
          </div>
          <div className="press-asset">
            <HaruloMark monochrome />
            <a href="/brand/harulo-master.svg" download>
              Monochrome master SVG ↗
            </a>
          </div>
          <div className="press-asset">
            <HaruloLockup />
            <a href="/brand/harulo-publisher.svg" download>
              Publisher lockup SVG ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
export function NewsArticleView({
  item,
  catalog,
  prefix,
}: {
  item: PressItem;
  catalog: PublisherCatalog;
  prefix: string;
}) {
  const product = catalog.products.find((p) => p.id === item.productId);
  return (
    <main id="main" tabIndex={-1} className="page-width content-page">
      <Link className="text-link" href={`${prefix}/press`}>
        ← Publication desk
      </Link>
      <PageIntro
        eyebrow={`Fictional announcement / ${formatDate(item.publishedAt)}`}
        title={item.title}
        description={item.summary}
      />
      <article className="article">
        {item.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {product && (
          <Link
            className="text-link"
            href={`${prefix}/software/${product.slug}`}
          >
            {product.name} publication record ↗
          </Link>
        )}
        <p>
          Source: Harulo Studio, synthetic 2036 design universe. No real
          release, press coverage or endorsement is claimed.
        </p>
        <HaruloLockup />
      </article>
    </main>
  );
}
