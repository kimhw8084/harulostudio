import { notFound } from "next/navigation";
import Link from "@/components/site-link";
import { PageIntro } from "@/components/publishing-views";
import { liveCatalog, productBySlug } from "@/lib/publishing/catalog";
import { pageMetadata } from "@/lib/publishing/metadata";

type Props = { params: Promise<{ slug: string }> };

async function resolve({ params }: Props) {
  const product = productBySlug(liveCatalog, (await params).slug);
  if (!product || product.provenance !== "verified" || !product.history?.length) notFound();
  return product;
}

export async function generateMetadata(props: Props) {
  const product = await resolve(props);
  return pageMetadata(`${product.name} history`, `The verified product history for ${product.name}.`, `/software/${product.slug}/history`);
}

export default async function ProductHistory({ params }: Props) {
  const product = await resolve({ params });
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <PageIntro eyebrow={product.name} title="Product history" description="Verified milestones and product changes." />
      <ol className="support-list">
        {product.history!.map((entry) => (
          <li key={`${entry.date}-${entry.version}`}>
            <Link href={`/software/${product.slug}`}>{entry.version} / {entry.title}</Link>
            <p><time dateTime={entry.date}>{entry.date}</time> — {entry.summary}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
