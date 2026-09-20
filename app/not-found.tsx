import Link from "@/components/site-link";
import { PageIntro } from "@/components/publishing-views";
import { Direction } from "@/components/publisher-mark";
export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <PageIntro
        eyebrow="404 / A different direction"
        title="Nothing published here."
        description="This page may have moved, or the edition hasn’t been published. Let’s find a useful way back."
      />
      <Link className="primary-link" href="/">
        Back to Harulo <Direction />
      </Link>
    </main>
  );
}
