import { notFound } from "next/navigation";
import { ReleaseView } from "@/components/publishing-views";
import { liveCatalog, productBySlug, productReleases } from "@/lib/publishing/catalog";
import { jsonLd, pageMetadata, releaseSchema } from "@/lib/publishing/metadata";

type Props = { params: Promise<{ product: string; version: string }> };
async function resolve({ params }: Props) {
  const { product: slug, version } = await params;
  const product = productBySlug(liveCatalog, slug);
  const release = product ? productReleases(liveCatalog, product.id).find((item) => item.version === version) : undefined;
  if (!product || !release || release.provenance !== "verified") notFound();
  return { product, release };
}
export async function generateMetadata(props: Props) {
  const { product, release } = await resolve(props);
  return pageMetadata(`${product.name} ${release.version}`, release.summary, `/releases/${product.slug}/${release.version}`);
}
export default async function ReleasePage(props: Props) {
  const { product, release } = await resolve(props);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(releaseSchema(product, release)) }} />
      <ReleaseView catalog={liveCatalog} product={product} release={release} />
    </>
  );
}
