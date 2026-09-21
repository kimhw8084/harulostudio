import type { Metadata } from "next";
import "./globals.css";
import "./scenes.css";
import { ExperienceProvider } from "@/components/experience-provider";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { studio } from "@/lib/site-content";
import { pageTransitionScript } from "@/lib/brand/page-transitions";
import { themeStyles, themeBootstrap } from "@/lib/brand/themes";

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
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <script dangerouslySetInnerHTML={{ __html: pageTransitionScript }} />
        <script
          dangerouslySetInnerHTML={{
            __html: themeBootstrap,
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
