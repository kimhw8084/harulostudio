import { HistoryView } from "@/components/universe-views";
import { liveCatalog } from "@/lib/publishing/catalog";
import { pageMetadata } from "@/lib/publishing/metadata";
export const metadata = pageMetadata(
  "History",
  "The publication history of Harulo Studio.",
  "/history",
);
export default function History() {
  return <HistoryView catalog={liveCatalog} />;
}
