import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harulo Studio — A little better, every day.",
  description: "Harulo Studio is an independent software studio with a simple aim: make the everyday a little easier. Meet the studio behind 하루로.",
  openGraph: { title: "Harulo Studio", description: "A little better, every day. Independent software with everyday life in mind.", type: "website", locale: "en_US", siteName: "Harulo Studio" },
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
