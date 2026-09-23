"use client";

import { HaruloMark } from "@/components/brand/harulo-mark";

const errorStyles = `
* { box-sizing: border-box; }
body { margin: 0; padding: 4rem 1.5rem; background: #F3F5FF; color: #101322; font: 1rem/1.6 Arial, sans-serif; }
.error-page { width: min(100%, 60rem); margin-inline: auto; }
.error-page .harulo-mark { width: 5rem; height: 5rem; color: #123DFF; }
.error-page .harulo-mark [data-piece="satellite"] { fill: #FF5C35; }
.error-page h1 { font-size: clamp(3rem, 9vw, 7rem); line-height: 1; letter-spacing: -.06em; }
.error-page em { color: #123DFF; font-style: normal; }
.error-page p { max-width: 45ch; }
.error-actions { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 2rem; }
.error-actions :is(a,button) { display: inline-flex; min-height: 44px; align-items: center; padding: .7rem 1rem; border: 1px solid #123DFF; background: #123DFF; color: #fff; font: inherit; cursor: pointer; }
.error-actions a { color: #123DFF; background: transparent; text-decoration: none; }
:is(a,button):focus-visible { outline: 3px solid #FF5C35; outline-offset: 3px; }
`;

export default function GlobalError() {
  return (
    <html lang="en">
      <head><style dangerouslySetInnerHTML={{ __html: errorStyles }} /></head>
      <body>
        <main className="error-page" id="main">
          <HaruloMark title="Harulo Studio" />
          <p className="eyebrow">A TEMPORARY INTERRUPTION</p>
          <h1>Harulo will<br /><em>return.</em></h1>
          <p>The page could not be loaded. Please refresh or return home.</p>
          <div className="error-actions">
            <button type="button" onClick={() => window.location.reload()}>Reload</button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">Return home</a>
          </div>
        </main>
      </body>
    </html>
  );
}
