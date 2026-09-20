import Link from "@/components/site-link";
import { Sun, ArrowRight } from "lucide-react";
import { studio } from "@/lib/site-content";
import {
  liveCatalog,
  publicProducts,
  productReleases,
} from "@/lib/publishing/catalog";
import type { PublisherCatalog } from "@/lib/publishing/types";
import { SoftwareSunrise } from "./software-sunrise";
import { CopyEmail } from "./copy-email";
import { Direction } from "./publisher-mark";
import { ProductEdition, ReleaseRow } from "./product-edition";

export function ContactSection() {
  return (
    <section
      className="contact-section page-width"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div>
        <p className="eyebrow">Good things start with a conversation</p>
        <h2 id="contact-title">
          What could be
          <br />
          <em>a little better?</em>
        </h2>
      </div>
      <div className="contact-details">
        <p>
          A question about Harulo, a suggestion, or a small frustration you wish
          software could solve. We’d like to hear it.
        </p>
        <a className="email-link" href={`mailto:${studio.email}`}>
          <span>{studio.email}</span>
          <Direction />
        </a>
        <CopyEmail email={studio.email} />
      </div>
    </section>
  );
}
export function StudioStory({ full = false }: { full?: boolean }) {
  return (
    <section
      className="story-section page-width"
      id="studio"
      aria-labelledby="story-title"
    >
      <div className="story-language">
        <span className="eyebrow">The direction in our name</span>
        <div className="korean-direction" lang="ko">
          <span>하루</span>
          <ArrowRight aria-hidden="true" />
          <span>
            하루<span className="korean-ro">로</span>
          </span>
        </div>
        <div className="language-labels metadata">
          <span>A DAY</span>
          <span>TOWARD A BETTER DAY ↗</span>
        </div>
        <div className="story-horizon" aria-hidden="true">
          <Sun />
        </div>
      </div>
      <div className="story-copy">
        <p className="eyebrow">Harulo · 하루로</p>
        <h2 id="story-title">
          It begins with
          <br />
          <em>an ordinary day.</em>
        </h2>
        <p>
          <span lang="ko">하루</span> means a day. In{" "}
          <span lang="ko">하루로</span>, we find a direction: toward a day that
          feels a little better.
        </p>
        <p>
          A repeated task. A small frustration. Something that could be clearer,
          calmer, or easier. That is where our software begins.
        </p>
        {full && (
          <p>
            Harulo Studio is an independent software publisher, built by one
            maker. We design, build, publish and maintain our own products. The
            ambition is simple: useful software with the care to keep getting
            better.
          </p>
        )}
        <p className="story-signoff" lang="ko">
          하루에서, 하루로.
        </p>
      </div>
    </section>
  );
}
export function MakingSection() {
  return (
    <section className="making-section">
      <div className="page-width">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The way we make</p>
            <h2>
              Small things.
              <br />
              <em>Considered completely.</em>
            </h2>
          </div>
          <p>
            Publishing is a beginning.
            <br />
            Care continues after release.
          </p>
        </div>
        <ol className="making-principles">
          {studio.principles.map((p) => (
            <li key={p.number}>
              <span className="metadata">{p.number} /</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
        <div className="making-cycle" aria-label="Our process">
          <span>Observe</span>
          <Direction />
          <span>Design</span>
          <Direction />
          <span>Build</span>
          <Direction />
          <span>Publish</span>
          <Direction />
          <span>Improve</span>
          <span className="cycle-again">
            Then begin again. <Sun aria-hidden="true" />
          </span>
        </div>
      </div>
    </section>
  );
}
export function HaruloSite({
  catalog = liveCatalog,
  prefix = "",
}: {
  catalog?: PublisherCatalog;
  prefix?: string;
}) {
  const products = publicProducts(catalog);
  const releases = productReleases(catalog).slice(0, 3);
  return (
    <main id="main" tabIndex={-1}>
      <section
        className="publisher-hero page-width"
        aria-labelledby="hero-title"
      >
        <div className="hero-copy">
          <p className="eyebrow publisher-eyebrow">
            <span className="eyebrow-line" />
            {studio.role}
          </p>
          <h1 id="hero-title">
            Software for <br />a little <br />
            <em>better day.</em>
          </h1>
          <p className="hero-description">{studio.description}</p>
          <div className="hero-actions">
            <Link
              className="primary-link"
              href={products.length ? `${prefix}/software` : "#software"}
            >
              {products.length ? "Explore our software" : "Meet the publisher"}
              <Direction />
            </Link>
            <a className="quiet-link" href="#contact">
              Say hello <Direction />
            </a>
          </div>
          <div className="hero-signature">
            <span lang="ko">조금 더 나은 하루로.</span>
            <span className="metadata">
              DESIGNED. BUILT. PUBLISHED. CARED FOR.
            </span>
          </div>
        </div>
        <SoftwareSunrise />
      </section>
      <div className="dayline page-width" aria-hidden="true">
        <span>01 / A BEGINNING</span>
        <span className="dayline-track">
          <span />
        </span>
        <span>INTO THE EVERYDAY ↗</span>
      </div>
      <section
        className="software-section page-width"
        id="software"
        aria-labelledby="software-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">The Harulo catalog</p>
            <h2 id="software-title">
              Useful by nature.
              <br />
              <em>Thoughtful by design.</em>
            </h2>
          </div>
          {products.length > 0 ? (
            <Link className="text-link" href={`${prefix}/software`}>
              All software{" "}
              <span className="metadata">
                {String(products.length).padStart(2, "0")}
              </span>
              <Direction />
            </Link>
          ) : (
            <span className="metadata">THE FIRST CHAPTER</span>
          )}
        </div>
        {products.length > 0 ? (
          <div className="publisher-shelf">
            {products.slice(0, 6).map((p) => (
              <ProductEdition key={p.id} product={p} prefix={prefix} />
            ))}
          </div>
        ) : (
          <div className="first-edition">
            <div className="first-edition-mark">
              <Sun aria-hidden="true" />
              <span className="metadata">HARULO / SOFTWARE</span>
            </div>
            <div>
              <h3>The first edition is still ahead.</h3>
              <p>
                There are no announced products yet. When our software is ready,
                you’ll find it here—with real details, release notes, and a way
                to get help.
              </p>
            </div>
            <Link className="text-link" href="/studio">
              About the studio <Direction />
            </Link>
          </div>
        )}
      </section>
      {releases.length > 0 && (
        <section
          className="recent-releases page-width"
          aria-labelledby="releases-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Published, and improving</p>
              <h2 id="releases-title">
                Fresh from <em>Harulo.</em>
              </h2>
            </div>
            <Link className="text-link" href={`${prefix}/releases`}>
              Release archive <Direction />
            </Link>
          </div>
          <ul className="release-list">
            {releases.map((r) => (
              <ReleaseRow
                key={r.id}
                release={r}
                product={products.find((p) => p.id === r.productId)!}
                prefix={prefix}
              />
            ))}
          </ul>
        </section>
      )}
      <StudioStory />
      <MakingSection />
      <ContactSection />
    </main>
  );
}
