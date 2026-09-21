import type { Metadata } from "next";
import type { Product, Release } from "./types";
import { studio } from "@/lib/site-content";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${studio.url}${path}` },
    openGraph: {
      title: `${title} — Harulo Studio`,
      description,
      url: `${studio.url}${path}`,
      type: "website",
      siteName: studio.name,
      images: [{ url: "/og.svg", width: 1200, height: 630, alt: "Harulo Studio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Harulo Studio`,
      description,
      images: ["/og.svg"],
    },
  };
}
export function productMetadata(product: Product): Metadata {
  const metadata = pageMetadata(
    product.name,
    product.tagline,
    `/software/${product.slug}`,
  );
  if (product.provenance !== "verified") {
    metadata.robots = { index: false, follow: false };
  }
  const image = product.media.find((m) => m.kind !== "video");
  if (image) {
    const url = new URL(image.src, studio.url).href;
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [
        { url, width: image.width, height: image.height, alt: image.alt },
      ],
    };
    metadata.twitter = {
      ...metadata.twitter,
      card: "summary_large_image",
      images: [url],
    };
  }
  return metadata;
}
export function softwareSchema(product: Product) {
  if (product.provenance !== "verified") return null;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.description,
    applicationCategory: product.category,
    operatingSystem: product.platforms.join(", "),
    softwareVersion: product.version,
    datePublished: product.firstReleasedAt,
    dateModified: product.latestReleasedAt,
    url: `${studio.url}/software/${product.slug}`,
    publisher: { "@type": "Organization", name: studio.name, url: studio.url },
  };
}
export function releaseSchema(product: Product, release: Release) {
  if (product.provenance !== "verified" || release.provenance !== "verified")
    return null;
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${product.name} ${release.version} — ${release.title}`,
    datePublished: release.publishedAt,
    description: release.summary,
    publisher: { "@type": "Organization", name: studio.name, url: studio.url },
    about: {
      "@type": "SoftwareApplication",
      name: product.name,
      softwareVersion: release.version,
    },
  };
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
