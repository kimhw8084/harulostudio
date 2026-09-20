import { SupportView } from "@/components/publishing-views";
import { liveCatalog } from "@/lib/publishing/catalog";
import { pageMetadata } from "@/lib/publishing/metadata";
export const metadata = pageMetadata(
  "Support",
  "Find help with Harulo software, or contact the studio.",
  "/support",
);
export default function Support() {
  return <SupportView catalog={liveCatalog} />;
}
