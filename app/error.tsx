"use client";

import { useEffect } from "react";
import { HaruloMark } from "@/components/brand/harulo-mark";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { /* Keep the production boundary quiet; details stay out of the public UI. */ }, []);
  return (
    <main className="error-page" id="main">
      <HaruloMark title="Harulo Studio" />
      <p className="eyebrow">A TEMPORARY INTERRUPTION</p>
      <h1>That page needs<br /><em>another try.</em></h1>
      <p>Something did not settle correctly. You can try again or return to the studio.</p>
      <div className="error-actions">
        <button type="button" onClick={() => reset()}>Try again</button>
        {/* Recovery remains native so it works even when the app router is unavailable. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">Return home</a>
      </div>
    </main>
  );
}
