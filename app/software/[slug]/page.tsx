import { notFound } from "next/navigation";
import { ProductView } from "@/components/publishing-views";
import { productBySlug } from "@/lib/publishing/catalog";
import { showcaseCatalog } from "@/lib/publishing/showcase";
import { pageMetadata } from "@/lib/publishing/metadata";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const p = productBySlug(showcaseCatalog, (await params).slug);
  return p
    ? {
        ...pageMetadata(`${p.name} showcase`, `${p.tagline} Interactive publication concept — not currently available.`, `/software/${p.slug}`),
        robots: { index: false, follow: false },
      }
    : {};
}
export default async function ProductPage({ params }: Props) {
  const p = productBySlug(showcaseCatalog, (await params).slug);
  if (!p) notFound();
  return <ProductView catalog={showcaseCatalog} product={p} />;
}
