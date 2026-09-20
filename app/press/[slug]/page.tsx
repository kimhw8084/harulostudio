import { notFound } from "next/navigation";
import { PageIntro } from "@/components/publishing-views";
import { liveCatalog, formatDate } from "@/lib/publishing/catalog";
import { pageMetadata } from "@/lib/publishing/metadata";
type Props = { params: Promise<{ slug: string }> };
async function record({ params }: Props) {
  const { slug } = await params;
  const item = liveCatalog.pressItems.find(
    (i) => i.slug === slug && i.provenance === "verified",
  );
  if (!item) notFound();
  return item;
}
export async function generateMetadata(props: Props) {
  const i = await record(props);
  return pageMetadata(i.title, i.summary, `/press/${i.slug}`);
}
export default async function PressItem(props: Props) {
  const i = await record(props);
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <PageIntro
        eyebrow={formatDate(i.publishedAt)}
        title={i.title}
        description={i.summary}
      />
      <article className="article">
        {i.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {i.assets.map((a) => (
          <p key={a.url}>
            <a href={a.url}>{a.label}</a> — {a.description}
          </p>
        ))}
      </article>
    </main>
  );
}
