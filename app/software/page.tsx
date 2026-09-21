import { CatalogView } from "@/components/publishing-views";
import { showcaseCatalog } from "@/lib/publishing/showcase";
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
  return <CatalogView catalog={showcaseCatalog} query={await searchParams} />;
}
