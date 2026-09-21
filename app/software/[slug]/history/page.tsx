import { notFound } from "next/navigation";
import { ProductHistoryView } from "@/components/universe-views";
import { liveCatalog, productBySlug } from "@/lib/publishing/catalog";
import { pageMetadata } from "@/lib/publishing/metadata";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const p = productBySlug(liveCatalog, (await params).slug);
  return p
    ? pageMetadata(
        `${p.name} history`,
        `Release history of ${p.name}.`,
        `/software/${p.slug}/history`,
      )
    : {};
}
export default async function ProductHistory({ params }: Props) {
  const p = productBySlug(liveCatalog, (await params).slug);
  if (!p) notFound();
  return <ProductHistoryView catalog={liveCatalog} product={p} prefix="" />;
}
