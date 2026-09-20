import { notFound } from "next/navigation";
import { SupportView } from "@/components/publishing-views";
import { liveCatalog, productBySlug } from "@/lib/publishing/catalog";
import { pageMetadata } from "@/lib/publishing/metadata";
type Props = { params: Promise<{ product: string }> };
export async function generateMetadata({ params }: Props) {
  const p = productBySlug(liveCatalog, (await params).product);
  return p
    ? pageMetadata(
        `${p.name} support`,
        `Help, guides and release details for ${p.name}.`,
        `/support/${p.slug}`,
      )
    : {};
}
export default async function SupportProduct({ params }: Props) {
  const p = productBySlug(liveCatalog, (await params).product);
  if (!p) notFound();
  return <SupportView catalog={liveCatalog} product={p} />;
}
