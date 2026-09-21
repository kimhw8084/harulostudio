import type { MetadataRoute } from "next";
import { studio } from "@/lib/site-content";

/** Only verified public destinations belong in the production sitemap. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/software", "/studio", "/press", "/privacy"].map((path) => ({
    url: `${studio.url}${path}`,
  }));
}
