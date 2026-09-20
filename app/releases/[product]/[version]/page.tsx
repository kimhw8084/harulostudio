import { notFound } from "next/navigation";
import { ReleaseView } from "@/components/publishing-views";
import {
  liveCatalog,
  productBySlug,
  productReleases,
  releasePath,
} from "@/lib/publishing/catalog";
import { pageMetadata, releaseSchema, jsonLd } from "@/lib/publishing/metadata";
type Props = { params: Promise<{ product: string; version: string }> };
async function record({ params }: Props) {
  const { product, version } = await params;
  const p = productBySlug(liveCatalog, product);
  const r =
    p && productReleases(liveCatalog, p.id).find((r) => r.version === version);
  if (!p || !r) notFound();
  return { p, r };
}
export async function generateMetadata(props: Props) {
  const { p, r } = await record(props);
  return pageMetadata(`${p.name} ${r.version}`, r.summary, releasePath(r, p));
}
export default async function ReleasePage(props: Props) {
  const { p, r } = await record(props);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(releaseSchema(p, r)) }}
      />
      <ReleaseView catalog={liveCatalog} product={p} release={r} />
    </>
  );
}
