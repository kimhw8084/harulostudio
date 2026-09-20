import { notFound } from "next/navigation";
import { SupportArticleView } from "@/components/publishing-views";
import { liveCatalog, productBySlug } from "@/lib/publishing/catalog";
import { pageMetadata } from "@/lib/publishing/metadata";
type Props = { params: Promise<{ product: string; article: string }> };
async function record({ params }: Props) {
  const { product, article } = await params;
  const p = productBySlug(liveCatalog, product);
  const a =
    p &&
    liveCatalog.supportArticles.find(
      (a) =>
        a.productId === p.id &&
        a.slug === article &&
        a.provenance === "verified",
    );
  if (!p || !a) notFound();
  return { p, a };
}
export async function generateMetadata(props: Props) {
  const { p, a } = await record(props);
  return pageMetadata(
    a.title,
    `Support for ${p.name}.`,
    `/support/${p.slug}/${a.slug}`,
  );
}
export default async function SupportArticle(props: Props) {
  const { p, a } = await record(props);
  return <SupportArticleView product={p} article={a} />;
}
