import { ArchiveView } from "@/components/universe-views";
import { liveCatalog } from "@/lib/publishing/catalog";
import { pageMetadata } from "@/lib/publishing/metadata";
export const metadata = pageMetadata(
  "Archive",
  "Permanent records and support status for Harulo publications.",
  "/archive",
);
export default function Archive() {
  return <ArchiveView catalog={liveCatalog} />;
}
