import type { MetadataRoute } from "next";
import { studio } from "@/lib/site-content";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/preview/" },
    sitemap: `${studio.url}/sitemap.xml`,
  };
}
