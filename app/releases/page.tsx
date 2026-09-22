import { notFound } from "next/navigation";
import { ReleasesView } from "@/components/publishing-views";
import { liveCatalog, hasVerifiedReleases } from "@/lib/publishing/catalog";
import type { Query } from "@/lib/publishing/types";

export default async function Releases({ searchParams }: { searchParams: Promise<Query> }) {
  if (!hasVerifiedReleases(liveCatalog)) notFound();
  return <ReleasesView catalog={liveCatalog} query={await searchParams} />;
}
