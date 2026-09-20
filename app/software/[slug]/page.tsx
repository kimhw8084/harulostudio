import { notFound } from "next/navigation";
import { ProductView } from "@/components/publishing-views";
import { liveCatalog, productBySlug } from "@/lib/publishing/catalog";
import {
  productMetadata,
  softwareSchema,
  jsonLd,
} from "@/lib/publishing/metadata";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const p = productBySlug(liveCatalog, (await params).slug);
  return p ? productMetadata(p) : {};
}
export default async function ProductPage({ params }: Props) {
  const p = productBySlug(liveCatalog, (await params).slug);
  if (!p) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(softwareSchema(p)) }}
      />
      <ProductView catalog={liveCatalog} product={p} />
    </>
  );
}
