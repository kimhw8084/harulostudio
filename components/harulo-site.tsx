import Link from "@/components/site-link";
import { ArrowRight } from "lucide-react";
import { studio } from "@/lib/site-content";
import {
  liveCatalog,
  publicProducts,
  productReleases,
} from "@/lib/publishing/catalog";
import type { PublisherCatalog } from "@/lib/publishing/types";
import { Dayfold } from "./dayfold";
import { CopyEmail } from "./copy-email";
import { Direction, FoldMark } from "./publisher-mark";
import { ProductEdition, ReleaseRow } from "./product-edition";

export function ContactSection() {
  return (
    <section
      className="contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="contact-top">
        <p className="eyebrow">THERE IS ALWAYS A NEXT DAY.</p>
        <span className="metadata" lang="ko">
          조금 더 나은 하루로.
        </span>
      </div>
      <h2 id="contact-title">
        WHAT COULD
        <br />
        BE <em>BETTER?</em>
        <Direction />
      </h2>
      <div className="contact-bottom">
        <p>
          A recurring frustration. A question. A possibility.
          <br />
          We’re listening.
        </p>
        <div className="contact-details">
          <a className="email-link" href={`mailto:${studio.email}`}>
            <span>{studio.email}</span>
            <Direction />
          </a>
          <CopyEmail email={studio.email} />
        </div>
      </div>
    </section>
  );
}
export function StudioStory({ full = false }: { full?: boolean }) {
  return (
    <section
      className="story-section"
      id="studio"
      aria-labelledby="story-title"
    >
      <div className="story-index metadata">03 / THE DIRECTION</div>
      <div className="story-copy">
        <p className="eyebrow">HARULO · 하루로</p>
        <h2 id="story-title">
          Not another app.
          <br />
          <em>A better everyday.</em>
        </h2>
        <p>
          <span lang="ko">하루</span> means a day. In{" "}
          <span lang="ko">하루로</span>, we find a direction: toward a day that
          feels a little better.
        </p>
        <p>
          We start with the thing you do again and again. The unnecessary step.
          The small interruption. Then we build software that gets it out of
          your way.
        </p>
        {full && (
          <p>
            Harulo Studio is an independent software publisher, built by one
            maker. We design, build, publish and maintain our own products.
            Independent in how we work. Intentional about what we put into the
            world.
          </p>
        )}
      </div>
      <div className="korean-direction" lang="ko">
        <span>하루</span>
        <ArrowRight aria-hidden="true" />
        <span>
          하루<b>로</b>
        </span>
      </div>
      <div className="language-labels metadata">
        <span>A DAY</span>
        <span>TOWARD A BETTER DAY</span>
      </div>
    </section>
  );
}
export function MakingSection() {
  return (
    <section className="making-section">
      <div className="making-intro">
        <p className="eyebrow">04 / A CONTINUOUS PRACTICE</p>
        <h2>
          MAKE.
          <br />
          RELEASE.
          <br />
          <em>REPEAT.</em>
        </h2>
        <FoldMark />
      </div>
      <div className="making-body">
        <p className="making-lead">Published is not finished.</p>
        <p>
          Software becomes part of someone’s day. We take that seriously. Every
          release is a beginning. Every improvement is a reason to keep going.
        </p>
        <ol className="making-principles">
          {studio.principles.map((p) => (
            <li key={p.number}>
              <span className="metadata">{p.number}</span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="making-cycle" aria-label="Our process">
          <span>Observe</span>
          <Direction />
          <span>Build</span>
          <Direction />
          <span>Publish</span>
          <Direction />
          <span>Improve</span>
          <span className="cycle-again">↺</span>
        </div>
      </div>
    </section>
  );
}
export function HaruloSite({
  catalog = liveCatalog,
  prefix = "",
  hero,
}: {
  catalog?: PublisherCatalog;
  prefix?: string;
  hero?: React.ReactNode;
}) {
  const products = publicProducts(catalog),
    releases = productReleases(catalog).slice(0, 3);
  return (
    <main id="main" tabIndex={-1} className="harulo-world">
      {hero ?? (
        <section className="publisher-hero" aria-labelledby="hero-title">
          <div className="hero-mast">
            <p className="publisher-eyebrow eyebrow">{studio.role}</p>
            <span className="metadata">
              WE DESIGN. BUILD. PUBLISH. MAINTAIN.
            </span>
          </div>
          <h1 id="hero-title" className="hero-wordmark">
            HARULO{" "}
            <span className="hero-studio">
              STUDIO <span lang="ko">하루로</span>
            </span>
          </h1>
          <Dayfold />
          <div className="hero-bottom">
            <h2>
              EVERY DAY.
              <br />
              <em>A NEW POSSIBILITY.</em>
            </h2>
            <div>
              <p className="hero-description">{studio.description}</p>
              <div className="hero-actions">
                <Link
                  className="primary-link"
                  href={products.length ? `${prefix}/software` : "#software"}
                >
                  {products.length
                    ? "Explore our software"
                    : "Meet the publisher"}
                  <Direction />
                </Link>
                <a className="quiet-link" href="#contact">
                  Say hello
                  <Direction />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
      <section
        className="software-section"
        id="software"
        aria-labelledby="software-title"
      >
        <div className="section-heading">
          <p className="eyebrow">01 / SOFTWARE, PUBLISHED.</p>
          <span className="metadata">
            {products.length
              ? `${String(products.length).padStart(2, "0")} EDITIONS / ONE PUBLISHER`
              : "THE FIRST EDITION IS STILL AHEAD"}
          </span>
        </div>
        <h2 id="software-title" className="catalog-title">
          LESS FRICTION.
          <br />
          <span>
            MORE <em>DAY.</em>
          </span>
        </h2>
        {products.length ? (
          <>
            <p className="catalog-instruction">
              One publisher. Different ways to make a day better.
              <br />
              Open an edition to step inside.
            </p>
            <div className="publisher-shelf">
              {products.slice(0, 6).map((p, i) => (
                <ProductEdition
                  key={p.id}
                  product={p}
                  prefix={prefix}
                  initiallyOpen={i === 0}
                />
              ))}
            </div>
            <Link className="catalog-all" href={`${prefix}/software`}>
              THE COMPLETE CATALOG
              <Direction />
            </Link>
          </>
        ) : (
          <div className="first-edition">
            <div className="unwritten-edition" aria-hidden="true">
              <span>H / 001</span>
              <FoldMark />
              <span>TO BE CONTINUED.</span>
            </div>
            <div>
              <p className="eyebrow">INDEPENDENT SOFTWARE. FROM THE START.</p>
              <h3>
                Good things
                <br />
                take <em>making.</em>
              </h3>
              <p>
                Our first product is still ahead. We’re here to make useful
                software, and this is where it will live—with real versions,
                release notes and a human way to get help.
              </p>
              <Link className="text-link" href="/studio">
                Inside the studio
                <Direction />
              </Link>
            </div>
          </div>
        )}
      </section>
      {releases.length > 0 && (
        <section className="recent-releases">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / ALWAYS BECOMING</p>
              <h2>
                OUT IN
                <br />
                <em>THE WORLD.</em>
              </h2>
            </div>
            <Link className="text-link" href={`${prefix}/releases`}>
              Release archive
              <Direction />
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
