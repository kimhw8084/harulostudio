"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, Check, Copy, Moon, Pause, Play, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { studio } from "@/lib/site-content";

function readPreference(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function savePreference(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* Preferences still work for this visit. */ }
}

export function HaruloSite() {
  const [evening, setEvening] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied" | "error">("idle");
  const artRef = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef<number | null>(null);
  const copyInFlight = useRef(false);
  const mounted = useRef(false);
  const isStill = paused || reducedMotion;

  useEffect(() => {
    mounted.current = true;
    document.documentElement.dataset.enhanced = "true";
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setEvening(readPreference("harulo-theme") === "evening");
      setPaused(readPreference("harulo-motion") === "paused");
      setReducedMotion(preference.matches);
    };
    sync();
    preference.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    return () => {
      mounted.current = false;
      delete document.documentElement.dataset.enhanced;
      preference.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
      if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = evening ? "evening" : "daylight";
    document.documentElement.dataset.motion = isStill ? "paused" : "running";
    if (isStill) {
      artRef.current?.style.setProperty("--pointer-x", "0px");
      artRef.current?.style.setProperty("--pointer-y", "0px");
      if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current);
    }
  }, [evening, isStill]);

  function toggleTheme() {
    savePreference("harulo-theme", evening ? "daylight" : "evening");
    setEvening(!evening);
  }
  function toggleMotion() {
    savePreference("harulo-motion", paused ? "running" : "paused");
    setPaused(!paused);
  }
  async function copyEmail() {
    if (copyInFlight.current) return;
    copyInFlight.current = true;
    setCopyState("copying");
    try {
      await navigator.clipboard.writeText(studio.email);
      if (mounted.current) setCopyState("copied");
    } catch {
      if (mounted.current) setCopyState("error");
    } finally { copyInFlight.current = false; }
  }

  return (
    <div className="harulo-site" id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header page-width">
        <a className="wordmark" href="#top" aria-label="Harulo Studio home"><Sun aria-hidden="true" /><span>harulo<span className="wordmark-studio">studio</span></span></a>
        <nav aria-label="Main navigation"><a href="#studio">The studio</a><a className="nav-contact" href="#contact">Say hello <ArrowUpRight aria-hidden="true" /></a></nav>
        <Button type="button" variant="ghost" className="theme-button" aria-label="Evening theme" aria-pressed={evening} onClick={toggleTheme}>{evening ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}<span>{evening ? "Evening" : "Daylight"}</span></Button>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" />Independent software studio</p>
            <h1 id="hero-title">A little better,<br /><em>every day.</em></h1>
            <p className="hero-description">{studio.description}</p>
            <a className="primary-link" href="#studio">Meet the studio <ArrowDown aria-hidden="true" /></a>
            <p className="hero-korean" lang="ko">{studio.koreanTagline}</p>
          </div>
          <figure className="hero-art">
            <div className="art-frame">
              <div className="art-window" ref={artRef} onPointerMove={(event) => {
                if (isStill || event.pointerType !== "mouse") return;
                const bounds = event.currentTarget.getBoundingClientRect();
                const x = ((event.clientX - bounds.left) / bounds.width - .5) * 10;
                const y = ((event.clientY - bounds.top) / bounds.height - .5) * 10;
                if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current);
                pointerFrame.current = requestAnimationFrame(() => {
                  artRef.current?.style.setProperty("--pointer-x", `${x}px`);
                  artRef.current?.style.setProperty("--pointer-y", `${y}px`);
                });
              }} onPointerLeave={() => {
                if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current);
                artRef.current?.style.setProperty("--pointer-x", "0px");
                artRef.current?.style.setProperty("--pointer-y", "0px");
              }}>
                <div className="art-drift"><img src="/images/daylight.jpg" alt="" width="1122" height="1402" fetchPriority="high" /></div>
              </div>
              <span className="art-seal" aria-hidden="true"><Sun /><span>FOR THE<br />EVERYDAY</span></span>
            </div>
            <figcaption><span>A little room for a better day.</span><span lang="ko">하루로</span></figcaption>
          </figure>
        </section>
        <div className="day-note page-width"><span>Small improvements. Real days.</span><span className="day-note-end">Built independently. Made with intention.</span></div>
        <section className="studio-section page-width" id="studio" aria-labelledby="studio-title">
          <div className="studio-heading"><p className="eyebrow"><span className="section-number">01 /</span> The studio</p><h2 id="studio-title">A studio built<br />around <em>a day.</em></h2><p className="name-signature" lang="ko">하루로<span aria-hidden="true">↗</span></p></div>
          <div className="studio-story"><p className="body-copy">Harulo takes its name from <span lang="ko">하루로</span>, inspired by <span lang="ko">하루</span>—the Korean word for a day.</p><p className="story-question">What could make someone’s day<br className="desktop-break" /> <em>a little better?</em></p><p className="body-copy">That question is where the work begins. Harulo Studio is my independent software studio. I build and publish my own apps, with an emphasis on clear design and details that make everyday use more enjoyable.</p><p className="studio-signoff">One maker. A little everyday intention.</p></div>
        </section>
        <section className="principles-section" aria-labelledby="principles-title"><div className="principles-layout page-width"><div className="principles-intro"><p className="eyebrow"><span className="section-number">02 /</span> A way of making</p><h2 id="principles-title">Small things.<br /><em>Real difference.</em></h2><p>The useful, the simple, and the details that make it feel right.</p><Sun className="principles-sun" aria-hidden="true" /></div><ol className="principles-list">{studio.principles.map((principle) => <li key={principle.number}><span className="principle-number" aria-hidden="true">{principle.number}</span><div><h3>{principle.title}</h3><p>{principle.body}</p></div></li>)}</ol></div></section>
        <section className="beginning-section page-width" aria-labelledby="beginning-title"><p className="eyebrow"><span className="section-number">03 /</span> The first chapter</p><div className="beginning-body"><h2 id="beginning-title">Starting with<br /><em>the everyday.</em></h2><div><p>This is the beginning of Harulo Studio. Future releases will have a home here.</p><a className="text-link" href="#contact">Have something in mind? <ArrowUpRight aria-hidden="true" /></a></div></div></section>
        <section className="contact-section page-width" id="contact" aria-labelledby="contact-title">
          <div className="contact-heading"><p className="eyebrow">A conversation is a good beginning</p><h2 id="contact-title">Say <em>hello.</em><ArrowUpRight aria-hidden="true" /></h2></div>
          <div className="contact-details"><p>Have a question, a suggestion, or a small frustration you wish an app could solve? I’d love to hear it.</p><a className="email-link" href={`mailto:${studio.email}`}><span>{studio.email}</span><ArrowUpRight aria-hidden="true" /></a><div className="copy-row"><Button type="button" variant="ghost" className="copy-button" onClick={copyEmail} disabled={copyState === "copying"}>{copyState === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copyState === "copying" ? "Copying…" : "Copy email"}</Button><p role="status" aria-live="polite" aria-atomic="true" className="copy-status">{copyState === "copied" ? "Email copied." : copyState === "error" ? "Couldn’t copy. Select the address above, or open your email app." : ""}</p></div></div>
        </section>
      </main>
      <footer className="site-footer page-width"><div className="footer-brand"><span>Harulo Studio · <span lang="ko">하루로</span></span><span>A little better, every day.</span></div><div className="footer-tools"><Button type="button" variant="ghost" className="motion-button" onClick={toggleMotion} disabled={reducedMotion} aria-describedby={reducedMotion ? "motion-preference" : undefined}>{isStill ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}{reducedMotion ? "Motion reduced" : paused ? "Resume motion" : "Pause motion"}</Button>{reducedMotion && <span id="motion-preference" className="motion-note">Following your device preference.</span>}<a className="back-top" href="#top" aria-label="Back to top"><ArrowUp aria-hidden="true" /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Harulo Studio</span><span lang="ko">{studio.koreanTagline}</span></div></footer>
    </div>
  );
}
