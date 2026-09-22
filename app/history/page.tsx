import { notFound } from "next/navigation";
import { PageIntro } from "@/components/publishing-views";
import { liveCatalog } from "@/lib/publishing/catalog";

export default function History() {
  const milestones = liveCatalog.milestones?.filter((milestone) => milestone.provenance === "verified") ?? [];
  if (!milestones.length) notFound();
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <PageIntro eyebrow="Harulo / History" title="A verified studio history." description="Milestones are published here when there is a real record to share." />
      <ol className="support-list">
        {milestones.map((milestone) => <li key={milestone.id}><strong>{milestone.year} / {milestone.title}</strong><p>{milestone.description}</p></li>)}
      </ol>
    </main>
  );
}
