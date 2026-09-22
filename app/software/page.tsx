import { SoftwareCatalogView } from "@/components/publishing-views";
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
  return <SoftwareCatalogView query={await searchParams} />;
}
