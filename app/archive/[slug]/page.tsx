import { notFound } from "next/navigation";
import { ProductView } from "@/components/publishing-views";
import { liveCatalog, productBySlug } from "@/lib/publishing/catalog";

type Props = { params: Promise<{ slug: string }> };

export default async function ArchivedProduct({ params }: Props) {
  const product = productBySlug(liveCatalog, (await params).slug);
  if (!product || product.provenance !== "verified" || !["archived", "discontinued"].includes(product.status)) notFound();
  return <ProductView catalog={liveCatalog} product={product} />;
}
