import { PageIntro } from "@/components/publishing-views";
import { studio } from "@/lib/site-content";
import { pageMetadata } from "@/lib/publishing/metadata";

export const metadata = pageMetadata(
  "Privacy",
  "How the Harulo Studio website handles local preferences and contact.",
  "/privacy",
);

export default function Privacy() {
  return (
    <main id="main" tabIndex={-1} className="content-page page-width">
      <PageIntro
        eyebrow="Harulo / Privacy"
        title="A clear account of this website."
        description="Harulo Studio is intentionally small. This page describes the data practices of this website, not future software products."
      />
      <article className="article legal-page">
        <h2>What this site stores locally</h2>
        <p>Your selected light or dark theme and motion preference may be stored in your browser so the site can respect your choice on a later visit.</p>
        <h2>What showcase interactions do</h2>
        <p>The five software demonstrations on this site run in your browser. Notes, toggles, focus states and selections stay in the current session. They are not sent to Harulo Studio.</p>
        <h2>Accounts and tracking</h2>
        <p>This site does not require an account. Harulo has not added advertising or analytics to these interactions. Hosting providers may keep routine technical logs needed to deliver and secure the site.</p>
        <h2>Contact</h2>
        <p>If you email {studio.email}, the email service and your mail provider will process that message so Harulo can reply. Please do not include sensitive information in an introductory message.</p>
        <p className="metadata">Last reviewed: 21 Sep 2026</p>
      </article>
    </main>
  );
}
