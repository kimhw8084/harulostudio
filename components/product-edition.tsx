import Link from "@/components/site-link";
import { Plus } from "lucide-react";
import type { Product, Release } from "@/lib/publishing/types";
import {
  formatDate,
  releasePath,
  statusLabels,
} from "@/lib/publishing/catalog";
import { Direction } from "./publisher-mark";
import { ApplicationInstrument } from "./application-instrument";
import { BrandSlot } from "./brand-slot";
import { ProductGlyph } from "./brand/product-glyph";
import { HaruloMark } from "./brand/harulo-mark";
import { ExtendedInstrument } from "./extended-instrument";

export function ProductIcon({ product }: { product: Product }) {
  return (
    <span className="product-icon" data-tone={product.tone}>
      <BrandSlot product={product.icon}>
        <ProductGlyph kind={product.icon} />
      </BrandSlot>
    </span>
  );
}
export function ConceptInterface({ product }: { product: Product }) {
  if (product.specimen) return <ExtendedInstrument product={product} />;
  return <ApplicationInstrument name={product.name} kind={product.icon} />;
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
  initiallyOpen = false,
}: {
  product: Product;
  prefix?: string;
  initiallyOpen?: boolean;
}) {
  return (
    <article
      className="product-edition"
      data-tone={product.tone}
      data-systems="03 06 11 12 14 18"
    >
      <details className="edition-disclosure" open={initiallyOpen || undefined}>
        <summary
          className="edition-spine"
          aria-label={`Toggle ${product.name} edition`}
        >
          <span className="edition-number">
            <HaruloMark />
            {product.edition}
          </span>
          <h3 className="edition-spine-title">
            {product.name}
            {product.koreanName && <span lang="ko">{product.koreanName}</span>}
          </h3>
          <span className="edition-spine-meta">
            {product.category}
            <br />
            {product.version
              ? `v${product.version}`
              : statusLabels[product.status]}{" "}
            / {statusLabels[product.status]}
          </span>
          <span className="edition-toggle">
            <Plus aria-hidden="true" />
          </span>
        </summary>
        <div className="edition-interior">
          <div className="edition-info">
            <ProductIcon product={product} />
            <span className="eyebrow">{product.category}</span>
            <p>{product.tagline}</p>
            <div className="edition-meta metadata">
              <span>{product.platforms.join(" / ")}</span>
              <span>
                {product.version
                  ? `VERSION ${product.version}`
                  : statusLabels[product.status]}{" "}
                / {statusLabels[product.status].toUpperCase()}
              </span>
            </div>
            <Link
              className="text-link"
              href={`${prefix}/software/${product.slug}`}
              aria-label={`Explore ${product.name}`}
            >
              Explore {product.name}
              <Direction />
            </Link>
          </div>
          <div className="edition-media" data-publication={product.slug}>
            <ProductMedia product={product} />
          </div>
        </div>
        <div className="edition-imprint">
          <span>
            <HaruloMark /> A HARULO STUDIO EDITION / {product.edition}
          </span>
          <span>PUBLICATION → APPLICATION</span>
        </div>
      </details>
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
    <li className="release-row" data-kind={release.kind}>
      <time className="metadata" dateTime={release.publishedAt}>
        {formatDate(release.publishedAt)}
      </time>
      <Link href={releasePath(release, product, prefix)}>
        <span className="release-product">
          {product.name}
          <span className="version">{release.version}</span>
        </span>
        <span className="release-summary">{release.title}</span>
      </Link>
      <span className="release-kind metadata">{release.kind}</span>
      <Direction />
    </li>
  );
}
