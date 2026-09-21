import { notFound } from "next/navigation";
import { ProductView } from "@/components/publishing-views";
import { liveCatalog, productBySlug } from "@/lib/publishing/catalog";
import { productMetadata } from "@/lib/publishing/metadata";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const p = productBySlug(liveCatalog, (await params).slug);
  return p ? productMetadata(p) : {};
}
export default async function ArchivedProduct({ params }: Props) {
  const p = productBySlug(liveCatalog, (await params).slug);
  if (!p || !["maintenance", "archived", "discontinued"].includes(p.status))
    notFound();
  return <ProductView catalog={liveCatalog} product={p} />;
}
