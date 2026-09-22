"use client";

import "./globals.css";
import { HaruloMark } from "@/components/brand/harulo-mark";

export default function GlobalError() {
  return (
    <html lang="en">
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
