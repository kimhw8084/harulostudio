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

export function ProductIcon({ product }: { product: Product }) {
  const paths: Record<Product["icon"], React.ReactNode> = {
    sound: (
      <>
        {[16, 28, 40, 28, 16].map((h, i) => (
          <rect key={i} x={5 + i * 8} y={(48 - h) / 2} width="4" height={h} />
        ))}
      </>
    ),
    notes: (
      <g transform="rotate(-25 24 24)">
        <path d="M5 9h31v5H5zM10 21h31v5H10zM15 33h28v5H15z" />
      </g>
    ),
    focus: (
      <>
        <path d="M24 3a21 21 0 0 1 21 21h-7A14 14 0 0 0 24 10ZM24 45A21 21 0 0 1 3 24h7a14 14 0 0 0 14 14Z" />
        <circle cx="24" cy="24" r="5" />
      </>
    ),
    weather: (
      <>
        <path d="M8 22a16 16 0 0 1 32 0H8ZM3 28h42v4H3zM8 37h32v4H8z" />
      </>
    ),
    spending: (
      <g transform="rotate(-35 24 24)">
        <path d="M5 8h18v9H5zM25 20h18v9H25zM5 32h18v9H5z" />
      </g>
    ),
    planning: (
      <>
        <path d="M4 7h33v5H4zM4 22h22v5H4zM4 37h11v5H4zM32 22h12v20h-5V27h-7Z" />
      </>
    ),
  };
  return (
    <span className="product-icon" data-tone={product.tone}>
      <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">
        {paths[product.icon]}
      </svg>
    </span>
  );
}
export function ConceptInterface({ product }: { product: Product }) {
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
    <article className="product-edition" data-tone={product.tone}>
      <details className="edition-disclosure" open={initiallyOpen || undefined}>
        <summary
          className="edition-spine"
          aria-label={`Toggle ${product.name} edition`}
        >
          <span className="edition-number">{product.edition}</span>
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
          <div className="edition-media">
            <ProductMedia product={product} />
          </div>
        </div>
        <div className="edition-imprint">
          <span>A HARULO STUDIO EDITION / {product.edition}</span>
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
    <li className="release-row">
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
