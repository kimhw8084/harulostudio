import Link from "@/components/site-link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { studio } from "@/lib/site-content";
import type {
  Product,
  PublisherCatalog,
  Query,
  Release,
  SupportArticle,
} from "@/lib/publishing/types";
import {
  publicProducts,
  productReleases,
  filterProducts,
  filterReleases,
  paginate,
  pageHref,
  queryValue,
  statusLabels,
  formatDate,
  releasePath,
  getPublicPublications,
  hasProductSupport,
} from "@/lib/publishing/catalog";
import { brandCopy } from "@/lib/brand/copy";
import { Direction, PublisherMark, FoldMark } from "./publisher-mark";
import { SoftwareXRay } from "./brand/software-xray";
import {
  ProductEdition,
  ProductIcon,
  ProductMedia,
  ReleaseRow,
} from "./product-edition";

export function PageIntro({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: string;
  description: string;
  id?: string;
}) {
  return (
    <div className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1 id={id}>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

export function EmptyPublication({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="empty-publication">
      <FoldMark />
      <div>
        <h2>{title}</h2>
        <p>{children}</p>
        <a className="text-link" href={`mailto:${studio.email}`}>
          Contact the studio <Direction />
        </a>
      </div>
    </div>
  );
}
function SelectFilter({
  name,
  label,
  query,
  options,
}: {
  name: string;
  label: string;
  query: Query;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="filter-field">
      <label htmlFor={`filter-${name}`}>{label}</label>
      <NativeSelect
        id={`filter-${name}`}
        name={name}
        defaultValue={queryValue(query, name)}
      >
        <NativeSelectOption value="">
          All {label.toLowerCase()}
        </NativeSelectOption>
        {options.map((o) => (
          <NativeSelectOption key={o.value} value={o.value}>
            {o.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}
function Pagination({
  path,
  query,
  page,
  pages,
  total,
}: {
  path: string;
  query: Query;
  page: number;
  pages: number;
  total: number;
}) {
  if (pages < 2) return null;
  return (
    <nav className="pagination" aria-label="Result pages">
      {page > 1 ? (
        <Link href={pageHref(path, query, page - 1)}>
          <ArrowLeft aria-hidden="true" size={16} /> Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="metadata">
        Page {page} of {pages} · {total} results
      </span>
      {page < pages ? (
        <Link href={pageHref(path, query, page + 1)}>
          Next <ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
export function CatalogView({
  catalog,
  query = {},
  prefix = "",
}: {
  catalog: PublisherCatalog;
  query?: Query;
  prefix?: string;
}) {
  const all = publicProducts(catalog);
  const result = paginate(filterProducts(all, query), query);
  const path = `${prefix}/software`;
  const platforms = [...new Set(all.flatMap((p) => p.platforms))];
  const statuses = [...new Set(all.map((p) => p.status))];
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <PageIntro
        eyebrow={catalog.edition === "showcase" ? "Harulo / showcase" : "The Harulo catalog"}
        title={catalog.edition === "showcase" ? brandCopy.catalog : "Software for everyday life."}
        description={catalog.edition === "showcase" ? "Interactive concepts showing how Harulo software can be introduced, explored and maintained. These are not currently available products." : "Thoughtful tools, published with care. Find something that makes a small part of your day a little better."}
      />
      {catalog.edition === "showcase" && <p className="showcase-disclosure page-disclosure">SHOWCASE PUBLICATION · INTERACTIVE CONCEPT · NOT CURRENTLY AVAILABLE</p>}
      {!all.length ? (
        <EmptyPublication title="The first edition is still ahead.">
          There are no announced products yet. This is where each release will
          find its home, with clear availability, version history and support.
        </EmptyPublication>
      ) : (
        <>
          <form className="filters" method="get" action={path}>
            <label className="filter-search">
              Find software
              <Input
                name="q"
                defaultValue={queryValue(query, "q")}
                placeholder="Name or category"
              />
            </label>
            <SelectFilter
              name="platform"
              label="Platforms"
              query={query}
              options={platforms.map((p) => ({ value: p, label: p }))}
            />
            {!(catalog.edition === "showcase" && statuses.length <= 1) && (
              <SelectFilter
                name="status"
                label="States"
                query={query}
                options={statuses.map((s) => ({
                  value: s,
                  label: statusLabels[s],
                }))}
              />
            )}
            <Button type="submit">Filter software</Button>
            <Link className="quiet-link" href={path}>
              Reset
            </Link>
          </form>
          <p className="results-count">
            {result.total} {result.total === 1 ? "edition" : "editions"}
            {queryValue(query, "q")
              ? ` matching “${queryValue(query, "q")}”`
              : ""}
          </p>
          {result.total ? (
            <div className="publisher-shelf">
              {result.items.map((p) => (
                <ProductEdition key={p.id} product={p} prefix={prefix} />
              ))}
            </div>
          ) : (
            <EmptyPublication title="No editions match.">
              Try another name, platform or availability state.
            </EmptyPublication>
          )}
          <Pagination path={path} query={query} {...result} />
        </>
      )}
    </main>
  );
}

/** Production software index: verified work first, concepts clearly separated. */
export function SoftwareCatalogView({ query = {} }: { query?: Query }) {
  const { verified: allVerified, showcase: allShowcase } = getPublicPublications();
  const verified = filterProducts(allVerified, query);
  const showcase = filterProducts(allShowcase, query);
  const platformOptions = [...new Set([...allVerified, ...allShowcase].flatMap((product) => product.platforms))].sort();
  const showFilters = allVerified.length + allShowcase.length >= 8 || Boolean(queryValue(query, "q") || queryValue(query, "platform"));
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <PageIntro
        eyebrow="Harulo / software"
        title={brandCopy.catalog}
        description="Published software when it is ready; interactive concepts while the work is still becoming."
      />
      {showFilters && <form className="filters" method="get" action="/software">
        <label>Search <Input name="q" defaultValue={queryValue(query, "q")} placeholder="Name, category or purpose" /></label>
        <label>Platform <NativeSelect name="platform" defaultValue={queryValue(query, "platform")}>
          <NativeSelectOption value="">All platforms</NativeSelectOption>
          {platformOptions.map((platform) => <NativeSelectOption key={platform} value={platform}>{platform}</NativeSelectOption>)}
        </NativeSelect></label>
        <Button type="submit">Filter</Button>
        <Link href="/software">Reset</Link>
      </form>}
      {verified.length > 0 && (
        <section className="catalog-section" aria-labelledby="verified-software-title">
          <div className="section-heading">
            <p className="eyebrow">AVAILABLE SOFTWARE</p>
            <h2 id="verified-software-title">Published editions.</h2>
          </div>
          <div className="publisher-shelf">
            {verified.map((product) => (
              <ProductEdition key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
      <section className="catalog-section" aria-labelledby="showcase-software-title">
        <div className="section-heading">
            <p className="eyebrow">SHOWCASE STUDIES</p>
          <h2 id="showcase-software-title">Showcase studies</h2>
        </div>
        <p className="showcase-disclosure page-disclosure">
          Interactive concept — not released software.
        </p>
        <div className="publisher-shelf">
          {showcase.map((product) => (
            <ProductEdition key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
export function ReleasesView({
  catalog,
  query = {},
  prefix = "",
}: {
  catalog: PublisherCatalog;
  query?: Query;
  prefix?: string;
}) {
  const products = publicProducts(catalog);
  const all = productReleases(catalog);
  const result = paginate(filterReleases(catalog, query), query);
  const path = `${prefix}/releases`;
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <PageIntro
        eyebrow="The publication record"
        title="A little better, release by release."
        description="New beginnings and considered improvements. The history of Harulo software, in one place."
      />
      {!all.length ? (
        <EmptyPublication title="A history yet to be written.">
          No software releases have been announced. When they are, every edition
          and improvement will have a permanent record here.
        </EmptyPublication>
      ) : (
        <>
          <form className="filters" method="get" action={path}>
            <label className="filter-search">
              Version or keyword
              <Input
                name="q"
                defaultValue={queryValue(query, "q")}
                placeholder="Version, title or change"
              />
            </label>
            <SelectFilter
              name="product"
              label="Products"
              query={query}
              options={products.map((p) => ({ value: p.id, label: p.name }))}
            />
            <SelectFilter
              name="year"
              label="Years"
              query={query}
              options={[...new Set(all.map((r) => r.publishedAt.slice(0, 4)))]
                .sort()
                .reverse()
                .map((y) => ({ value: y, label: y }))}
            />
            <SelectFilter
              name="platform"
              label="Platforms"
              query={query}
              options={[...new Set(all.flatMap((r) => r.platforms))].map(
                (p) => ({ value: p, label: p }),
              )}
            />
            <SelectFilter
              name="type"
              label="Types"
              query={query}
              options={[
                { value: "major", label: "Major release" },
                { value: "feature", label: "Feature update" },
                { value: "maintenance", label: "Maintenance" },
                { value: "preview", label: "Preview" },
              ]}
            />
            <Button type="submit">Filter releases</Button>
            <SelectFilter
              name="channel"
              label="Channels"
              query={query}
              options={[
                { value: "stable", label: "Stable" },
                { value: "preview", label: "Preview" },
                { value: "beta", label: "Beta" },
              ]}
            />
            <Link className="quiet-link" href={path}>
              Reset
            </Link>
          </form>
          <p className="results-count">
            {result.total} {result.total === 1 ? "release" : "releases"}
          </p>
          {result.total ? (
            <ul className="release-list">
              {result.items.map((r) => (
                <ReleaseRow
                  key={r.id}
                  release={r}
                  product={products.find((p) => p.id === r.productId)!}
                  prefix={prefix}
                />
              ))}
            </ul>
          ) : (
            <EmptyPublication title="No releases match.">
              Try a different product, year, version or release type.
            </EmptyPublication>
          )}
          <Pagination path={path} query={query} {...result} />
        </>
      )}
    </main>
  );
}
export function ProductView({
  catalog,
  product,
  prefix = "",
}: {
  catalog: PublisherCatalog;
  product: Product;
  prefix?: string;
}) {
  const releases = productReleases(catalog, product.id);
  const productHasSupport = hasProductSupport(catalog, product.id);
  const related = publicProducts(catalog)
    .filter((p) => p.id !== product.id)
    .slice(0, 2);
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <div className="detail-breadcrumb">
        <Link href={`${prefix}/software`}>Software</Link> / {product.name}
      </div>
      <section className="product-detail-hero">
        <div>
          <p className="eyebrow">HARULO / SOFTWARE EDITION {product.edition}</p>
          <h1 id="product-detail-title">{product.name}</h1>
          <p className="product-tagline">{product.tagline}</p>
          <p className="product-description">{product.description}</p>
          <div className="product-detail-meta">
            <span className="status-label">{product.provenance === "showcase" ? "Interactive concept" : statusLabels[product.status]}</span>
            <span className="metadata">
              {product.provenance === "showcase" ? null : product.version && `v${product.version}`}<br />
              {product.platforms.join(" / ")}
            </span>
          </div>
          <div className="product-detail-actions">
            {product.downloads.map((d) => (
              <a className="primary-link" key={d.id} href={d.url}>
                {d.label}
                <Direction />
              </a>
            ))}
            {product.productUrl && (
              <a className="primary-link" href={product.productUrl}>
                Open {product.name}
                <Direction />
              </a>
            )}
            {productHasSupport && <Link className="text-link" href={`${prefix}/support/${product.slug}`}>Product support <Direction /></Link>}
          </div>
          {product.provenance === "verified" && product.status === "preview" && (
            <p className="resource-note">
              A preview is still evolving.{" "}
              {product.expectedRelease
                ? `Stable release planned for ${product.expectedRelease}.`
                : "Check release notes before relying on it for important work."}
            </p>
          )}
          {["archived", "discontinued"].includes(product.status) && (
            <p className="resource-note">
              {product.archiveReason ||
                "This edition is no longer in active development. Its release record remains available."}
            </p>
          )}
        </div>
      </section>
      <section className="product-workspace" aria-label={`${product.name} interactive concept`} data-tone={product.tone} data-publication={product.slug}>
        {product.provenance !== "verified" ? <SoftwareXRay product={product}><ProductMedia product={product} /></SoftwareXRay> : <ProductMedia product={product} />}
      </section>
      {catalog.edition !== "live" && <p className="resource-note product-truth">Not released software. The sample runs locally in this page.</p>}
      <section className="detail-section detail-grid">
        <h2>
          Made for
          <br />
          <em>the everyday.</em>
        </h2>
        <div className="feature-grid">
          {product.features.map((f) => (
            <div key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>
      {catalog.edition === "live" && releases.length > 0 && (
        <section className="detail-section">
          <div className="section-heading">
            <h2>What’s new.</h2>
            <Link
              className="text-link"
              href={`${prefix}/releases?product=${product.id}`}
            >
              All versions <Direction />
            </Link>
          </div>
          <ul className="release-list">
            {releases.slice(0, 3).map((r) => (
              <ReleaseRow
                key={r.id}
                release={r}
                product={product}
                prefix={prefix}
              />
            ))}
          </ul>
        </section>
      )}
      <section className="detail-section detail-grid">
        <h2>The details.</h2>
        <div>
          <dl className="facts-list">
            <div>
              <dt>Platforms</dt>
              <dd>{product.platforms.join(", ")}</dd>
            </div>
            {product.provenance === "verified" && (
              <div>
                <dt>Latest version</dt>
                <dd>{product.version || "Not announced"}</dd>
              </div>
            )}
            {product.provenance === "verified" && product.firstReleasedAt && (
              <div>
                <dt>First edition</dt>
                <dd>{formatDate(product.firstReleasedAt)}</dd>
              </div>
            )}
            {product.provenance === "verified" && product.latestReleasedAt && (
              <div>
                <dt>Latest update</dt>
                <dd>{formatDate(product.latestReleasedAt)}</dd>
              </div>
            )}
            <div>
              <dt>Languages</dt>
              <dd>{product.languages.join(", ")}</dd>
            </div>
            {product.provenance === "verified" && (
              <div>
                <dt>Release channels</dt>
                <dd>{product.channels.join(", ")}</dd>
              </div>
            )}
            {product.provenance === "verified" && product.price && (
              <div>
                <dt>Pricing</dt>
                <dd>{product.price.text}</dd>
              </div>
            )}
            {product.requirements.map((r) => (
              <div key={r.platform}>
                <dt>{r.platform} requirements</dt>
                <dd>{r.description}</dd>
              </div>
            ))}
          </dl>
          {product.accessibility.length > 0 && (
            <div className="article">
              <h3>Accessibility</h3>
              <ul>
                {product.accessibility.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="resource-links">
            {Object.entries(product.resources).map(([label, url]) => (
              <a className="text-link" href={url} key={label}>
                {label}
                <Direction />
              </a>
            ))}
            {product.provenance === "verified" && product.privacy && (
              <Link
                className="text-link"
                href={`${prefix}/software/${product.slug}/privacy`}
              >
                Product privacy <Direction />
              </Link>
            )}
          </div>
          {product.downloads.length > 0 && (
            <div className="article">
              <h3>Download details</h3>
              {product.downloads.map((d) => (
                <div key={d.id}>
                  <p>
                    {d.label} · {d.channel}
                    {d.architecture && ` · ${d.architecture}`}
                    {d.size && ` · ${d.size}`}
                  </p>
                  {d.signature && <p>Signature: {d.signature}</p>}
                  {d.checksum && (
                    <p className="metadata">Checksum: {d.checksum}</p>
                  )}
                  {d.autoUpdate && <p>{d.autoUpdate}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {related.length > 0 && (
        <section className="detail-section">
          <div className="section-heading">
            <h2>
              Also from <em>Harulo.</em>
            </h2>
          </div>
          <div className="publisher-shelf">
            {related.map((p) => (
              <ProductEdition key={p.id} product={p} prefix={prefix} variant="related" />
            ))}
          </div>
        </section>
      )}
      <div className="closing-line">
        <PublisherMark />
        <p>{product.provenance === "showcase" ? "An interactive Harulo Studio publication study." : "Designed, built and published by Harulo Studio."}</p>
      </div>
    </main>
  );
}
export function ReleaseView({
  catalog,
  product,
  release,
  prefix = "",
}: {
  catalog: PublisherCatalog;
  product: Product;
  release: Release;
  prefix?: string;
}) {
  const history = productReleases(catalog, product.id);
  const index = history.findIndex((r) => r.id === release.id);
  const older = history[index + 1],
    newer = history[index - 1];
  const groups = [
    ["Improvements", release.improvements],
    ["Fixes", release.fixes],
    ["Security notes", release.securityNotes],
    ["Compatibility", release.compatibility],
    ["Known issues", release.knownIssues],
  ] as const;
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <div className="detail-breadcrumb">
        <Link href={`${prefix}/releases`}>Releases</Link> /{" "}
        <Link href={`${prefix}/software/${product.slug}`}>{product.name}</Link>
      </div>
      <PageIntro
        eyebrow={`${product.name} / ${release.version}`}
        title={release.title}
        description={release.summary}
      />
      <article className="article">
        <div className="article-meta metadata">
          <time dateTime={release.publishedAt}>
            {formatDate(release.publishedAt)}
          </time>
          <span>{release.channel}</span>
          <span>{release.platforms.join(" / ")}</span>
        </div>
        {groups
          .filter(([, items]) => items.length > 0)
          .map(([heading, items]) => (
            <section className="article-section" key={heading}>
              <h2>{heading}</h2>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        {release.downloads.length > 0 && (
          <section>
            <h2>Get this version</h2>
            {release.downloads.map((d) => (
              <p key={d.id}>
                <a href={d.url}>{d.label}</a>
                {d.size && ` · ${d.size}`}
              </p>
            ))}
          </section>
        )}
        <nav className="pagination" aria-label="Release history">
          {older ? (
            <Link href={releasePath(older, product, prefix)}>
              ← {older.version}
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link href={releasePath(newer, product, prefix)}>
              {newer.version} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
        <PublisherMark compact />
      </article>
    </main>
  );
}
export function SupportView({
  catalog,
  product,
  prefix = "",
  query = {},
}: {
  catalog: PublisherCatalog;
  product?: Product;
  prefix?: string;
  query?: Query;
}) {
  const products = publicProducts(catalog);
  const articles = catalog.supportArticles.filter(
    (a) =>
      (!product || a.productId === product.id) &&
      (!queryValue(query, "q") ||
        `${a.title} ${a.sections.flatMap((s) => s.paragraphs).join(" ")}`
          .toLowerCase()
          .includes(queryValue(query, "q").toLowerCase())) &&
      (catalog.edition === "demo" || a.provenance === "verified"),
  );
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <PageIntro
        eyebrow="A little help, when you need it"
        title={product ? `${product.name} support` : "Let’s get you unstuck."}
        description={
          product
            ? `Guides and useful details for ${product.name}.`
            : "Help belongs alongside the software. Find a product below, or get in touch with the studio."
        }
      />
      {products.length > 0 && (
        <form
          className="filters"
          method="get"
          action={`${prefix}/support${product ? `/${product.slug}` : ""}`}
        >
          <label>
            Search documentation
            <Input
              name="q"
              defaultValue={queryValue(query, "q")}
              placeholder="Export, keyboard, migration…"
            />
          </label>
          <Button>Find help</Button>
          <Link href={`${prefix}/support${product ? `/${product.slug}` : ""}`}>
            Reset
          </Link>
        </form>
      )}
      {!product && queryValue(query, "q") ? (
        <>
          <p className="results-count">{articles.length} matching guides</p>
          <ul className="support-list">
            {articles.map((a) => {
              const p = products.find((p) => p.id === a.productId)!;
              return (
                <li key={a.id}>
                  <Link href={`${prefix}/support/${p.slug}/${a.slug}`}>
                    {p.name} / {a.title} ↗
                  </Link>
                  <p>{a.category.replaceAll("-", " ")}</p>
                </li>
              );
            })}
          </ul>
          {!articles.length && (
            <EmptyPublication title="No guides match.">
              Try a product name or a shorter description of the problem.
            </EmptyPublication>
          )}
        </>
      ) : product ? (
        <>
          <div className="article-meta">
            <ProductIcon product={product} />
            <span>
              {product.version
                ? `Current version: ${product.version}`
                : statusLabels[product.status]}
              <br />
              {product.platforms.join(" / ")}
            </span>
          </div>
          <ul className="support-list">
            {articles.map((a) => (
              <li key={a.id}>
                <Link href={`${prefix}/support/${product.slug}/${a.slug}`}>
                  {a.title}
                  <Direction />
                </Link>
                <p>{a.category.replaceAll("-", " ")}</p>
              </li>
            ))}
          </ul>
          {!articles.length && (
            <p className="resource-note">
              No guides have been published yet. Contact the studio for help
              with this product.
            </p>
          )}
          <Link
            className="text-link"
            href={`${prefix}/releases?product=${product.id}`}
          >
            Release notes and known issues <Direction />
          </Link>
        </>
      ) : products.length ? (
        <ul className="support-list">
          {products.map((p) => (
            <li key={p.id}>
              <Link href={`${prefix}/support/${p.slug}`}>
                {p.name}
                <Direction />
              </Link>
              <p>
                {p.platforms.join(" / ")} · {statusLabels[p.status]}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyPublication title="We’re here to help.">
          There are no published products to choose from yet. For a question
          about Harulo Studio, write to us directly.
        </EmptyPublication>
      )}
      <div className="detail-section article">
        <h2>A human conversation.</h2>
        <p>
          Email <a href={`mailto:${studio.email}`}>{studio.email}</a>. For a
          software issue, include the product, version, operating system and
          what you expected to happen. Please leave passwords and other
          sensitive details out.
        </p>
      </div>
    </main>
  );
}
export function SupportArticleView({
  product,
  article,
  prefix = "",
}: {
  product: Product;
  article: SupportArticle;
  prefix?: string;
}) {
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <div className="detail-breadcrumb">
        <Link href={`${prefix}/support/${product.slug}`}>
          {product.name} support
        </Link>
      </div>
      <PageIntro
        eyebrow={product.name}
        title={article.title}
        description={`Updated ${formatDate(article.updatedAt)}`}
      />
      <article className="article">
        {article.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}
        <a className="text-link" href={`mailto:${studio.email}`}>
          Contact support <Direction />
        </a>
      </article>
    </main>
  );
}
export function ProductPrivacyView({ product }: { product: Product }) {
  const p = product.privacy!;
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <PageIntro
        eyebrow={`${product.name} / Privacy`}
        title="Your information, explained."
        description={`Last revised ${formatDate(p.updatedAt)}`}
      />
      <article className="article">
        <p>{p.summary}</p>
        <h2>Data collected</h2>
        <ul>
          {p.collected.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h2>Data not collected</h2>
        <ul>
          {p.notCollected.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        {p.storage && (
          <>
            <h2>Storage</h2>
            <p>{p.storage}</p>
          </>
        )}
        <h2>Retention</h2>
        <p>{p.retention}</p>
        <h2>Deletion</h2>
        <p>{p.deletion}</p>
        <h2>Services</h2>
        <ul>
          {p.services.map((s) => (
            <li key={s.name}>
              {s.name}: {s.purpose}
            </li>
          ))}
        </ul>
        <h2>Revision history</h2>
        <ul>
          {p.history.map((h) => (
            <li key={h.date}>
              {formatDate(h.date)} — {h.change}
            </li>
          ))}
        </ul>
        <p>
          Questions: <a href={`mailto:${studio.email}`}>{studio.email}</a>
        </p>
      </article>
    </main>
  );
}
