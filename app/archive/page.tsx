import { notFound } from "next/navigation";
import Link from "@/components/site-link";
import { PageIntro } from "@/components/publishing-views";
import { hasArchive, liveCatalog, publicProducts } from "@/lib/publishing/catalog";

export default function Archive() {
  if (!hasArchive(liveCatalog)) notFound();
  const products = publicProducts(liveCatalog).filter((product) => ["archived", "discontinued"].includes(product.status));
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <PageIntro eyebrow="Harulo / Archive" title="Published work, kept with care." description="Verified products that are no longer actively maintained." />
      <ul className="support-list">
        {products.map((product) => (
          <li key={product.id}>
            <Link href={`/archive/${product.slug}`}>{product.name}</Link>
            <p>{product.archiveReason || "Archived publication."}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
