import { notFound } from "next/navigation";
import { SupportView } from "@/components/publishing-views";
import { liveCatalog, productBySlug } from "@/lib/publishing/catalog";
type Props = { params: Promise<{ product: string }> };
export default async function ProductSupport({ params }: Props) {
  const product = productBySlug(liveCatalog, (await params).product);
  if (!product || !liveCatalog.supportArticles.some((article) => article.productId === product.id && article.provenance === "verified")) notFound();
  return <SupportView catalog={liveCatalog} product={product} />;
}
