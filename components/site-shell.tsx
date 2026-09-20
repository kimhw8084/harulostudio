import Link from "@/components/site-link";
import { ArrowUp, Sun } from "lucide-react";
import { studio } from "@/lib/site-content";
import { ThemeControl, MotionControl } from "./experience-provider";
import { PublisherMark, Direction } from "./publisher-mark";

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header page-width" id="top">
        <Link className="wordmark" href="/" aria-label="Harulo Studio home">
          <Sun aria-hidden="true" />
          <span>
            harulo<span className="wordmark-studio">studio</span>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/software">Software</Link>
          <Link href="/releases">Releases</Link>
          <Link href="/studio">Studio</Link>
          <Link href="/support">Support</Link>
        </nav>
        <ThemeControl />
      </header>
    </>
  );
}
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-width">
        <div className="footer-top">
          <div>
            <PublisherMark />
            <p>A little better, every day.</p>
            <p lang="ko">조금 더 나은 하루로.</p>
          </div>
          <nav aria-label="Publisher navigation">
            <Link href="/software">Software</Link>
            <Link href="/releases">Releases</Link>
            <Link href="/support">Support</Link>
            <Link href="/press">Press</Link>
            <a href={studio.github}>
              GitHub <Direction />
            </a>
            <a href={`mailto:${studio.email}`}>
              Contact <Direction />
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Harulo Studio</span>
          <MotionControl />
          <a href="#top" className="back-top" aria-label="Back to top">
            <ArrowUp aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
