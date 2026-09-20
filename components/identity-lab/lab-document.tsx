import { notFound } from "next/navigation";
import { HaruloSite } from "@/components/harulo-site";
import {
  CatalogView,
  ProductView,
  ReleasesView,
  ReleaseView,
  SupportView,
  SupportArticleView,
  ProductPrivacyView,
} from "@/components/publishing-views";
import { ProductEdition } from "@/components/product-edition";
import { PublisherMark } from "@/components/publisher-mark";
import {
  liveCatalog,
  productBySlug,
  productReleases,
} from "@/lib/publishing/catalog";
import { labCatalog, archiveCatalog } from "@/lib/identity/fixtures";
import type { Query } from "@/lib/publishing/types";
import { IdentityLab } from "./identity-lab";
import { LabHero, LabSpecialContext } from "./lab-context";

const prefix = "/preview/identity-lab";
export function LabDocument({ path, query }: { path: string[]; query: Query }) {
  let view: React.ReactNode;
  const context = path.join("/") || "home";
  if (!path.length || context === "home")
    view = (
      <HaruloSite catalog={labCatalog} prefix={prefix} hero={<LabHero />} />
    );
  else if (context === "hero")
    view = (
      <main id="main">
        <LabHero />
      </main>
    );
  else if (context === "software")
    view = <CatalogView catalog={labCatalog} query={query} prefix={prefix} />;
  else if (path[0] === "software" && path.length === 2) {
    const product = productBySlug(archiveCatalog, path[1]);
    if (!product) notFound();
    view = (
      <ProductView catalog={archiveCatalog} product={product} prefix={prefix} />
    );
  } else if (context === "releases")
    view = <ReleasesView catalog={labCatalog} query={query} prefix={prefix} />;
  else if (path[0] === "releases" && path.length === 3) {
    const product = productBySlug(labCatalog, path[1]);
    const release =
      product &&
      productReleases(labCatalog, product.id).find(
        (r) => r.version === path[2],
      );
    if (!product || !release) notFound();
    view = (
      <ReleaseView
        catalog={labCatalog}
        product={product}
        release={release}
        prefix={prefix}
      />
    );
  } else if (path[0] === "support" && path.length <= 3) {
    const product = path[1] ? productBySlug(labCatalog, path[1]) : undefined;
    if (path[1] && !product) notFound();
    if (path[2]) {
      const article = labCatalog.supportArticles.find(
        (a) => a.productId === product!.id && a.slug === path[2],
      );
      if (!article) notFound();
      view = (
        <SupportArticleView
          product={product!}
          article={article}
          prefix={prefix}
        />
      );
    } else
      view = (
        <SupportView catalog={labCatalog} product={product} prefix={prefix} />
      );
  } else if (
    (path[0] === "privacy" && path.length === 2) ||
    (path[0] === "software" && path.length === 3 && path[2] === "privacy")
  ) {
    const product = productBySlug(labCatalog, path[1]);
    if (!product) notFound();
    view = <ProductPrivacyView product={product} />;
  } else if (context === "edition")
    view = (
      <main id="main" className="lab-single-edition">
        <h1>Publication → application.</h1>
        <p>
          A complete edition, not an isolated logo mockup. Open and close the
          spine, try the audio controls, then explore the product.
        </p>
        <ProductEdition
          product={labCatalog.products[0]}
          prefix={prefix}
          initiallyOpen
        />
      </main>
    );
  else if (context === "empty")
    view = (
      <HaruloSite catalog={liveCatalog} prefix={prefix} hero={<LabHero />} />
    );
  else if (context === "archive")
    view = (
      <main id="main" className="lab-archive">
        <h1>Every edition has a life.</h1>
        <p>
          Fictional lifecycle states: current, maintained, preview, archived and
          discontinued. Historical product pages remain reachable without
          implying a current download.
        </p>
        <div className="lab-archive-states">
          {[
            "Available",
            "Maintained",
            "Preview",
            "Archived",
            "Discontinued",
          ].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        {archiveCatalog.products.map((product) => (
          <ProductEdition key={product.id} product={product} prefix={prefix} />
        ))}
      </main>
    );
  else if (context === "press")
    view = (
      <main id="main" className="lab-press">
        <h1>A publisher, on record.</h1>
        <p>
          Fictional announcements and candidate brand assets. These are design
          studies, not a real press kit or company history.
        </p>
        <div className="lab-press-list">
          {labCatalog.pressItems.map((item) => (
            <article key={item.id}>
              <time dateTime={item.publishedAt}>
                {item.publishedAt}
                <br />
                FICTIONAL ANNOUNCEMENT
              </time>
              <div>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
                {item.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <PublisherMark compact />
              </div>
            </article>
          ))}
        </div>
        <section className="lab-press-assets">
          <h2>One mark. Every imprint.</h2>
          <PublisherMark />
          <p>
            Boilerplate: Harulo Studio is an independent software publisher
            designing thoughtful tools for the small moments that make up
            everyday life.
          </p>
          <p>
            Brand assets are under review. No candidate is an approved permanent
            identity.
          </p>
          <a className="text-link" href={`${prefix}/social`}>
            View live social-card compositions ↗
          </a>
        </section>
      </main>
    );
  else if (
    ["social", "mobile", "favicon", "loading", "transition"].includes(context)
  )
    view = (
      <main id="main">
        <LabSpecialContext context={context} />
      </main>
    );
  else notFound();
  return (
    <IdentityLab context={context} initialWebsite={path.length > 0}>
      {view}
    </IdentityLab>
  );
}
