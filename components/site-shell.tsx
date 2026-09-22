"use client";
import Link from "@/components/site-link";
import { usePathname } from "next/navigation";
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
function descriptorForPath(pathname: string): PageBrandDescriptor {
  const clean = pathname.replace(/\/$/, "") || "/";
  const page = clean === "/" ? "home" : clean.startsWith("/software/") ? "product-detail" : clean.slice(1).replaceAll("/", "-") || "home";
  return {
    pageId: page,
    title: brandCopy.closing,
    metadata: ["HARULO STUDIO", "INDEPENDENT SOFTWARE PUBLISHER", brandCopy.master],
    anchors: {
      aperture: page === "home" ? "genesis-stage" : page === "studio" ? "story-title" : page === "press" ? "press-title" : page === "privacy" ? "privacy-title" : page === "product-detail" ? "product-detail-art" : "main",
      primary: page === "studio" ? "story-title" : page === "product-detail" ? "product-detail-title" : "footer-philosophy",
      secondary: page === "home" ? "software-title" : "footer-wordmark",
      signal: page === "home" ? "genesis-stage" : page === "studio" ? "story-title" : page === "product-detail" ? "product-detail-art" : page === "press" ? "press-title" : page === "privacy" ? "privacy-title" : "main",
    },
  };
}

export function SiteFooter() {
  const pathname = usePathname() || "/";
  const navigation = publicNavigation(liveCatalog);
  const descriptor = descriptorForPath(pathname);
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
      <p className="footer-philosophy" id="footer-philosophy">{brandCopy.master}</p>
      <div className="footer-wordmark" id="footer-wordmark">
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
