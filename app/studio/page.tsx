import { PageIntro } from "@/components/publishing-views";
import {
  StudioStory,
  MakingSection,
  ContactSection,
} from "@/components/harulo-site";
import { pageMetadata } from "@/lib/publishing/metadata";
export const metadata = pageMetadata(
  "The studio",
  "Harulo is an independent software publisher. Learn about 하루로 and the care behind the software.",
  "/studio",
);
export default function Studio() {
  return (
    <main id="main" tabIndex={-1}>
      <div className="page-width">
        <PageIntro
          eyebrow="Independent software publisher"
          title="Harulo Studio."
          description="Harulo designs, builds, publishes and maintains its own software. One maker, with a belief that small improvements to ordinary life are worth the care."
        />
      </div>
      <StudioStory full />
      <MakingSection />
      <ContactSection />
    </main>
  );
}
