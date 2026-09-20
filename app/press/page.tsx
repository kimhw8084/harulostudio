import Link from "@/components/site-link";
import { PageIntro } from "@/components/publishing-views";
import { PublisherMark, Direction } from "@/components/publisher-mark";
import { liveCatalog, publicProducts } from "@/lib/publishing/catalog";
import { studio } from "@/lib/site-content";
import { pageMetadata } from "@/lib/publishing/metadata";
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
        description="Company information and identity assets for writing about Harulo Studio."
      />
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
          <p>
            Website: <a href={studio.url}>harulostudio.com</a>
            <br />
            Press contact: <a href={`mailto:${studio.email}`}>{studio.email}</a>
          </p>
        </article>
      </div>
      <div className="press-assets">
        <div className="press-asset">
          <img
            src="/favicon.svg"
            alt="Harulo sun mark"
            width="64"
            height="64"
          />
          <p>Harulo sun mark</p>
          <a
            className="text-link"
            href="/favicon.svg"
            download="harulo-sun.svg"
          >
            Download SVG <Direction />
          </a>
        </div>
        <div className="press-asset">
          <PublisherMark />
          <p>Harulo publisher imprint</p>
          <a className="text-link" href="/brand/harulo-publisher.svg" download>
            Download SVG <Direction />
          </a>
        </div>
      </div>
      <p className="resource-note">
        Keep the marks in their original proportions and colors, with clear
        space around them. For product imagery or an interview, contact the
        studio.{" "}
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
