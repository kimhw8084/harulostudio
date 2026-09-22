import { notFound } from "next/navigation";
import { SupportArticleView } from "@/components/publishing-views";
import { liveCatalog, productBySlug } from "@/lib/publishing/catalog";
type Props = { params: Promise<{ product: string; article: string }> };
export default async function SupportArticle({ params }: Props) {
  const { product: slug, article: articleSlug } = await params;
  const product = productBySlug(liveCatalog, slug);
  const article = product ? liveCatalog.supportArticles.find((item) => item.productId === product.id && item.slug === articleSlug && item.provenance === "verified") : undefined;
  if (!product || !article) notFound();
  return <SupportArticleView product={product} article={article} />;
}
