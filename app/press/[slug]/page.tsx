import { notFound } from "next/navigation";
import { PageIntro } from "@/components/publishing-views";
import { liveCatalog } from "@/lib/publishing/catalog";
import { pageMetadata } from "@/lib/publishing/metadata";

type Props = { params: Promise<{ slug: string }> };

async function resolve({ params }: Props) {
  const { slug } = await params;
  const item = liveCatalog.pressItems.find((entry) => entry.slug === slug && entry.provenance === "verified");
  if (!item) notFound();
  return item;
}

export async function generateMetadata(props: Props) {
  const item = await resolve(props);
  return pageMetadata(item.title, item.summary, `/press/${item.slug}`);
}

export default async function PressArticle({ params }: Props) {
  const item = await resolve({ params });
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <PageIntro eyebrow="Harulo / Press" title={item.title} description={item.summary} />
      <article className="article">
        <time dateTime={item.publishedAt}>{item.publishedAt}</time>
        {item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {item.assets.length > 0 && <ul>{item.assets.map((asset) => <li key={asset.url}><a href={asset.url}>{asset.label}</a> — {asset.description}</li>)}</ul>}
      </article>
    </main>
  );
}
