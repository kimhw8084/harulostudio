import { notFound } from "next/navigation";
import { SupportView } from "@/components/publishing-views";
import { liveCatalog, hasVerifiedSupport } from "@/lib/publishing/catalog";
export default function Support() {
  if (!hasVerifiedSupport(liveCatalog)) notFound();
  return <SupportView catalog={liveCatalog} />;
}
