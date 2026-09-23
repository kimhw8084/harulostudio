"use client";
import Link from "@/components/site-link";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { studio } from "@/lib/site-content";
import { ThemeControl } from "./experience-provider";
import { Direction, FoldMark } from "./publisher-mark";
import { FooterReturn } from "./brand/footer-return";
import { MobileNavigation } from "./brand/mobile-navigation";
import { brandCopy } from "@/lib/brand/copy";
import { liveCatalog, publicNavigation } from "@/lib/publishing/catalog";

export function SiteHeader() {
  const navigation = publicNavigation(liveCatalog);
  const pathname = usePathname() || "/";
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header" id="top">
      <Link className="wordmark" href="/" aria-label="Harulo Studio home"><FoldMark /><span>HARULO<span>STUDIO / <span lang="ko">하루로</span></span></span></Link>
      <nav aria-label="Main navigation">{navigation.map((item) => <Link href={item.href} key={item.href} aria-current={pathname === item.href || pathname.startsWith(item.href + "/") ? "page" : undefined}>{item.label}</Link>)}</nav>
      <ThemeControl />
      <MobileNavigation />
      <span className="navigation-status" role="status" aria-live="polite">Opening page…</span>
    </header>
  </>;
}

export function SiteFooter() {
  const pathname = usePathname() || "/";
  const navigation = publicNavigation(liveCatalog);
  return <>
    {pathname === "/" && <FooterReturn />}
    <footer className="site-footer compact-footer">
      <div className="footer-identity"><FoldMark /><div><strong>HARULO STUDIO</strong><p>{brandCopy.master}</p></div></div>
      <nav aria-label="Publisher navigation">
        {navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        <Link href="/privacy">Privacy</Link>
        <a href={studio.github}>GitHub <Direction /></a>
        <a href={`mailto:${studio.email}`}>Contact <Direction /></a>
      </nav>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Harulo Studio</span><a href="#top" className="back-top" aria-label="Back to top"><ArrowUp aria-hidden="true" /></a></div>
    </footer>
  </>;
}
