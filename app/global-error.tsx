"use client";

import "./globals.css";
import Link from "next/link";
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
          <Link href="/">Return home</Link>
        </main>
      </body>
    </html>
  );
}
