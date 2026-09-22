import Link from "@/components/site-link";
import { ArrowUp } from "lucide-react";
import { studio } from "@/lib/site-content";
import { ThemeControl, MotionControl } from "./experience-provider";
import { PublisherMark, Direction, FoldMark } from "./publisher-mark";
import { FooterReturn, type PageBrandDescriptor } from "./brand/footer-return";
import { MobileNavigation } from "./brand/mobile-navigation";
import { brandCopy } from "@/lib/brand/copy";
import { liveCatalog, publicNavigation } from "@/lib/publishing/catalog";
export function SiteHeader() {
  const navigation = publicNavigation(liveCatalog);
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
          {navigation.map((item, index) => (
            <Link href={item.href} key={item.href}>
              {item.label}<span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            </Link>
          ))}
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
  const navigation = publicNavigation(liveCatalog);
  const descriptor: PageBrandDescriptor = {
    pageId: "site-shell",
    title: brandCopy.closing,
    metadata: ["HARULO STUDIO", "INDEPENDENT SOFTWARE PUBLISHER", brandCopy.master],
    anchors: { aperture: "footer-return-mark", primary: "footer-philosophy", secondary: "footer-wordmark", signal: "footer-return-signal" },
  };
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <PublisherMark />
        <nav aria-label="Publisher navigation">
          {navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
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
      <p className="footer-philosophy">{brandCopy.master}</p>
      <div className="footer-wordmark">
        <span aria-hidden="true">HARULO</span>
        <FooterReturn descriptor={descriptor} />
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
