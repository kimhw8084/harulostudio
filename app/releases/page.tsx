import { ReleasesView } from "@/components/publishing-views";
import { liveCatalog } from "@/lib/publishing/catalog";
import { pageMetadata } from "@/lib/publishing/metadata";
import type { Query } from "@/lib/publishing/types";
export const metadata = pageMetadata(
  "Releases",
  "The publication record for Harulo software. New beginnings and considered improvements.",
  "/releases",
);
export default async function Releases({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  return <ReleasesView catalog={liveCatalog} query={await searchParams} />;
}
