import { HaruloSite } from "@/components/harulo-site";
import { studio } from "@/lib/site-content";
import { jsonLd, pageMetadata } from "@/lib/publishing/metadata";
export const metadata = pageMetadata(
  "Independent software publisher",
  studio.description,
  "/",
);
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: studio.name,
            alternateName: studio.koreanName,
            url: studio.url,
            email: studio.email,
            description: studio.boilerplate,
            sameAs: [studio.github],
          }),
        }}
      />
      <HaruloSite />
    </>
  );
}
