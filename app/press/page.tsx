import Link from "@/components/site-link";
import { PageIntro, ReturnSourceAnchors } from "@/components/publishing-views";
import { PublisherMark, Direction } from "@/components/publisher-mark";
import { liveCatalog, publicProducts } from "@/lib/publishing/catalog";
import { studio } from "@/lib/site-content";
import { pageMetadata } from "@/lib/publishing/metadata";
import { HaruloMark, HaruloLockup } from "@/components/brand/harulo-mark";
import { brandCopy } from "@/lib/brand/copy";
export const metadata = pageMetadata(
  "Press",
  "Harulo Studio company description, identity assets and press contact.",
  "/press",
);
export default function Press() {
  const items = liveCatalog.pressItems.filter(
    (i) => i.provenance === "verified",
  );
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <PageIntro
        eyebrow="Harulo / Press room"
        title="A small introduction."
        id="press-title"
        description="Company information and identity assets for writing about Harulo Studio."
      />
      <ReturnSourceAnchors page="press" />
      <div className="detail-grid">
        <div>
          <PublisherMark />
        </div>
        <article className="article">
          <h2>About Harulo Studio</h2>
          <p>{studio.boilerplate}</p>
          <p>
            Harulo comes from <span lang="ko">하루</span>, a day. The name{" "}
            <span lang="ko">하루로</span> carries the studio’s direction: toward
            a day made a little better.
          </p>
          <p>{brandCopy.master}</p>
          <p>
            Website: <a href={studio.url}>harulostudio.com</a>
            <br />
            Press contact: <a href={`mailto:${studio.email}`}>{studio.email}</a>
          </p>
        </article>
      </div>
      <div className="press-assets">
        <div className="press-asset">
          <HaruloMark title="Harulo Cobalt Ember master" />
          <p>Master mark / Cobalt Ember</p>
          <a
            className="text-link"
            href="/brand/harulo-cobalt-ember.svg"
            download
          >
            Download SVG <Direction />
          </a>
        </div>
        <div className="press-asset">
          <HaruloMark title="Harulo master mark" monochrome />
          <p>Master mark / monochrome</p>
          <a className="text-link" href="/brand/harulo-master.svg" download>
            Download SVG <Direction />
          </a>
        </div>
        <div className="press-asset">
          <HaruloLockup />
          <p>Harulo publisher imprint</p>
          <a className="text-link" href="/brand/harulo-publisher.svg" download>
            Download SVG <Direction />
          </a>
        </div>
        <div className="press-asset inverse">
          <HaruloMark title="Harulo master mark, reversed" monochrome />
          <p>Master mark / reversed</p>
          <a className="text-link" href="/brand/harulo-reversed.svg" download>
            Download SVG <Direction />
          </a>
        </div>
        <div className="press-asset">
          <HaruloLockup vertical />
          <p>Vertical publisher lockup</p>
          <a className="text-link" href="/brand/harulo-vertical.svg" download>
            Download SVG <Direction />
          </a>
        </div>
      </div>
      <p className="resource-note">
        One ring. One satellite. Two tiers. Keep the supplied geometry intact,
        with clear space around the mark. Do not redraw, crop, stretch, or add
        elements to it. For product imagery or an interview, contact the studio.{" "}
        {publicProducts(liveCatalog).length === 0 &&
          "No product launches have been announced yet."}
      </p>
      {items.length > 0 && (
        <ul className="support-list">
          {items.map((i) => (
            <li key={i.id}>
              <Link href={`/press/${i.slug}`}>
                {i.title}
                <Direction />
              </Link>
              <p>{i.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
