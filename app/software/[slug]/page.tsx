import { notFound } from "next/navigation";
import { ProductView } from "@/components/publishing-views";
import { liveCatalog, resolvePublication } from "@/lib/publishing/catalog";
import { showcaseCatalog } from "@/lib/publishing/showcase";
import { jsonLd, pageMetadata, softwareSchema } from "@/lib/publishing/metadata";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const resolved = resolvePublication((await params).slug);
  const p = resolved?.product;
  return p
    ? {
        ...pageMetadata(
          resolved.kind === "showcase" ? `${p.name} showcase` : p.name,
          resolved.kind === "showcase"
            ? `${p.tagline} Interactive publication concept — not currently available.`
            : p.tagline,
          `/software/${p.slug}`,
        ),
        ...(resolved.kind === "showcase" ? { robots: { index: false, follow: false } } : {}),
      }
    : {};
}
export default async function ProductPage({ params }: Props) {
  const resolved = resolvePublication((await params).slug);
  if (!resolved) notFound();
  const schema = resolved.kind === "verified" ? softwareSchema(resolved.product) : null;
  return (
    <>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />}
      <ProductView catalog={resolved.kind === "verified" ? liveCatalog : showcaseCatalog} product={resolved.product} />
    </>
  );
}
