import Link from "@/components/site-link";
import {
  AudioLines,
  NotebookPen,
  CircleDot,
  CloudSun,
  Wallet,
  CalendarDays,
} from "lucide-react";
import type { Product, Release } from "@/lib/publishing/types";
import {
  formatDate,
  releasePath,
  statusLabels,
} from "@/lib/publishing/catalog";
import { Direction } from "./publisher-mark";

const icons = {
  sound: AudioLines,
  notes: NotebookPen,
  focus: CircleDot,
  weather: CloudSun,
  spending: Wallet,
  planning: CalendarDays,
};
export function ProductIcon({ product }: { product: Product }) {
  const Icon = icons[product.icon];
  return (
    <span className="product-icon" data-tone={product.tone}>
      <Icon aria-hidden="true" />
    </span>
  );
}

/** Only used for explicitly labelled synthetic records. Never called a screenshot. */
export function ConceptInterface({ product }: { product: Product }) {
  return (
    <div
      className="concept-interface"
      aria-label={`${product.name} fictional interface concept`}
    >
      <div className="concept-chrome">
        <ProductIcon product={product} />
        <span>{product.name}</span>
        <span className="metadata">CONCEPT INTERFACE</span>
      </div>
      {product.icon === "sound" ? (
        <div className="concept-audio">
          <p className="concept-title">A quieter kind of control.</p>
          {[
            ["Music", "64%"],
            ["Browser", "28%"],
            ["System", "45%"],
          ].map(([name, level]) => (
            <div className="audio-line" key={name}>
              <span>{name}</span>
              <span className="audio-track">
                <span style={{ width: level }} />
              </span>
              <span>{level}</span>
            </div>
          ))}
          <div className="concept-bottom">
            Output <span>Studio speakers ↗</span>
          </div>
        </div>
      ) : product.icon === "notes" ? (
        <div className="concept-notes">
          <aside>
            Today
            <br />
            Daily notes
            <br />
            Collections
            <br />
            Connected ideas
          </aside>
          <div>
            <span className="metadata">A THOUGHT TO KEEP</span>
            <p className="concept-title">
              Good things
              <br />
              take root.
            </p>
            <p>There is a little more room for the ideas worth returning to.</p>
            <span className="note-link">↗ A walk, a thought, a beginning</span>
          </div>
        </div>
      ) : (
        <div className="concept-simple">
          <span className="metadata">{product.category.toUpperCase()}</span>
          <p className="concept-title">
            {product.icon === "focus"
              ? "One thing at a time."
              : product.icon === "weather"
                ? "A good day to step outside."
                : product.icon === "spending"
                  ? "A little more understanding."
                  : "Leave room for tomorrow."}
          </p>
          <div className="concept-rule" />
          <p>{product.features[0]?.title}</p>
          <p className="metadata">{product.features[1]?.title}</p>
        </div>
      )}
    </div>
  );
}
export function ProductMedia({ product }: { product: Product }) {
  const media = product.media.find(
    (m) => m.kind === "screenshot" || m.kind === "artwork",
  );
  if (media)
    return (
      <img
        className="product-screenshot"
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading="lazy"
      />
    );
  if (product.provenance === "synthetic")
    return <ConceptInterface product={product} />;
  return (
    <div className="edition-type-cover">
      <ProductIcon product={product} />
      <span>{product.name}</span>
      <p>{product.tagline}</p>
    </div>
  );
}
export function ProductEdition({
  product,
  prefix = "",
}: {
  product: Product;
  prefix?: string;
}) {
  return (
    <article className="product-edition" data-tone={product.tone}>
      <Link
        className="edition-cover"
        href={`${prefix}/software/${product.slug}`}
        aria-label={`Explore ${product.name}`}
      >
        <div className="edition-cover-head">
          <span>EDITION {product.edition}</span>
          <span>{statusLabels[product.status]}</span>
        </div>
        <div className="edition-cover-title">
          <ProductIcon product={product} />
          <h3>{product.name}</h3>
          {product.koreanName && <span lang="ko">{product.koreanName}</span>}
        </div>
        <ProductMedia product={product} />
        <span className="edition-imprint">
          A HARULO STUDIO EDITION <Direction />
        </span>
      </Link>
      <div className="edition-info">
        <span className="metadata">{product.category}</span>
        <p>{product.tagline}</p>
        <div className="edition-meta metadata">
          <span>{product.platforms.join(" / ")}</span>
          <span>
            {product.version
              ? `v${product.version}`
              : statusLabels[product.status]}
          </span>
        </div>
      </div>
    </article>
  );
}
export function ReleaseRow({
  release,
  product,
  prefix = "",
}: {
  release: Release;
  product: Product;
  prefix?: string;
}) {
  return (
    <li className="release-row">
      <time className="metadata" dateTime={release.publishedAt}>
        {formatDate(release.publishedAt)}
      </time>
      <Link href={releasePath(release, product, prefix)}>
        <span className="release-product">
          {product.name} <span className="version">{release.version}</span>
        </span>
        <span className="release-summary">{release.title}</span>
      </Link>
      <span className="release-kind metadata">{release.kind}</span>
      <Direction />
    </li>
  );
}
