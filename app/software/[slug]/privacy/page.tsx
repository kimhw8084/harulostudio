import { notFound } from "next/navigation";
import { ProductPrivacyView } from "@/components/publishing-views";
import { liveCatalog, productBySlug } from "@/lib/publishing/catalog";
import { pageMetadata } from "@/lib/publishing/metadata";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const p = productBySlug(liveCatalog, (await params).slug);
  return p?.privacy
    ? pageMetadata(
        `${p.name} privacy`,
        p.privacy.summary,
        `/software/${p.slug}/privacy`,
      )
    : {};
}
export default async function ProductPrivacy({ params }: Props) {
  const p = productBySlug(liveCatalog, (await params).slug);
  if (!p?.privacy) notFound();
  return <ProductPrivacyView product={p} />;
}
