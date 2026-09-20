import type { Metadata } from "next";
import "./globals.css";
import { ExperienceProvider } from "@/components/experience-provider";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { studio } from "@/lib/site-content";

export const metadata: Metadata = {
  metadataBase: new URL(studio.url),
  title: {
    default: "Harulo Studio — Independent software publisher",
    template: "%s — Harulo Studio",
  },
  description: studio.description,
  openGraph: {
    title: "Harulo Studio — Independent software publisher",
    description: studio.description,
    type: "website",
    locale: "en_US",
    siteName: "Harulo Studio",
  },
  twitter: {
    card: "summary",
    title: "Harulo Studio",
    description: studio.description,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('harulo-theme');document.documentElement.dataset.theme=t==='evening'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)?'evening':'daylight';document.documentElement.dataset.motion=localStorage.getItem('harulo-motion')==='paused'||matchMedia('(prefers-reduced-motion: reduce)').matches?'paused':'running'}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased">
        <ExperienceProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ExperienceProvider>
      </body>
    </html>
  );
}
