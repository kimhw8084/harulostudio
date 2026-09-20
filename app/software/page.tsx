import { CatalogView } from "@/components/publishing-views";
import { liveCatalog } from "@/lib/publishing/catalog";
import { pageMetadata } from "@/lib/publishing/metadata";
import type { Query } from "@/lib/publishing/types";
export const metadata = pageMetadata(
  "Software",
  "The Harulo software catalog. Thoughtful tools for everyday life.",
  "/software",
);
export default async function Software({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  return <CatalogView catalog={liveCatalog} query={await searchParams} />;
}
