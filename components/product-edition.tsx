import Link from "@/components/site-link";
import Image from "next/image";
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
  return <ApplicationInstrument name={product.name} kind={product.icon} />;
}
export function ProductMedia({ product }: { product: Product }) {
  const media = product.media.find(
    (m) => m.kind === "screenshot" || m.kind === "artwork",
  );
  if (media)
    return (
      <Image
        className="product-screenshot"
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading="lazy"
      />
    );
  if (product.provenance !== "verified")
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
  variant = "catalog",
}: {
  product: Product;
  prefix?: string;
  variant?: "home" | "catalog" | "related";
}) {
  return (
    <article className="product-edition edition-card" data-tone={product.tone} data-variant={variant} data-publication={product.slug}>
      <span className="edition-number">{product.edition}</span>
      <div className="edition-card-main">
        <div className="edition-card-title"><ProductIcon product={product} /><h3>{product.name}{product.koreanName && <span lang="ko">{product.koreanName}</span>}</h3></div>
        <p>{product.tagline}</p>
      </div>
      <div className="edition-card-side"><span>{product.category}</span><span>{product.provenance === "showcase" ? "Interactive concept" : statusLabels[product.status]}</span></div>
      <Link className="edition-card-link" href={`${prefix}/software/${product.slug}`} aria-label={`Explore ${product.name}`}>Explore <Direction /></Link>
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
