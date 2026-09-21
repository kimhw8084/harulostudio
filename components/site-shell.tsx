import Link from "@/components/site-link";
import { ArrowUp } from "lucide-react";
import { studio } from "@/lib/site-content";
import { ThemeControl, MotionControl } from "./experience-provider";
import { PublisherMark, Direction, FoldMark } from "./publisher-mark";
import { FooterReturn } from "./brand/footer-return";
import { MobileNavigation } from "./brand/mobile-navigation";
export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header" id="top">
        <Link className="wordmark" href="/" aria-label="Harulo Studio home">
          <FoldMark />
          <span>
            HARULO
            <span>
              STUDIO / <span lang="ko">하루로</span>
            </span>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/software">
            Software<span aria-hidden="true">01</span>
          </Link>
          <Link href="/studio">
            Studio<span aria-hidden="true">02</span>
          </Link>
          <Link href="/press">
            Press<span aria-hidden="true">03</span>
          </Link>
        </nav>
        <ThemeControl />
        <MobileNavigation />
        <span className="navigation-status" role="status" aria-live="polite">
          Opening next page…
        </span>
      </header>
    </>
  );
}
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <PublisherMark />
        <nav aria-label="Publisher navigation">
          <Link href="/software">Software</Link>
          <Link href="/press">Press</Link>
          <Link href="/privacy">Privacy</Link>
          <a href={studio.github}>
            GitHub
            <Direction />
          </a>
          <a href={`mailto:${studio.email}`}>
            Contact
            <Direction />
          </a>
        </nav>
      </div>
      <p className="footer-philosophy">A little better, every day.</p>
      <div className="footer-wordmark">
        <span aria-hidden="true">HARULO</span>
        <FooterReturn />
      </div>
      <div className="footer-bottom">
        <div>
          <span>© {new Date().getFullYear()} Harulo Studio</span>
          <p lang="ko">조금 더 나은 하루로.</p>
        </div>
        <MotionControl />
        <a href="#top" className="back-top" aria-label="Back to top">
          <ArrowUp aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
