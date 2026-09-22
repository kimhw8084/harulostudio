import { notFound } from "next/navigation";
import { ProductPrivacyView } from "@/components/publishing-views";
import { liveCatalog, productBySlug } from "@/lib/publishing/catalog";
import { pageMetadata } from "@/lib/publishing/metadata";

type Props = { params: Promise<{ slug: string }> };

async function resolve({ params }: Props) {
  const product = productBySlug(liveCatalog, (await params).slug);
  if (!product || product.provenance !== "verified" || !product.privacy) notFound();
  return product;
}

export async function generateMetadata(props: Props) {
  const product = await resolve(props);
  return pageMetadata(`${product.name} privacy`, `Privacy information for ${product.name}.`, `/software/${product.slug}/privacy`);
}

export default async function ProductPrivacy({ params }: Props) {
  return <ProductPrivacyView product={await resolve({ params })} />;
}
