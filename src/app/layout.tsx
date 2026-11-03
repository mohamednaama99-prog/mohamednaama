import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";

import { site } from "@/content/site";

import "./globals.css";

/* Archivo carries the optical width axis, which the display scale relies on
   (wdth 108–112). Only the axes we actually use are requested. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0e2344",
  colorScheme: "light",
};

/* Scroll reveals stay hidden only when JavaScript can actually un-hide them.
   Without this class — JS disabled, or no IntersectionObserver — every
   section renders normally for crawlers and for the reader. */
const revealBoot = `if("IntersectionObserver" in window)document.documentElement.classList.add("reveal-ready");`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      /* The boot script below adds `reveal-ready` to <html> before React
         hydrates, which React would otherwise report as a mismatch. */
      suppressHydrationWarning
      className={`${archivo.variable} ${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-surface text-ink">
        <script dangerouslySetInnerHTML={{ __html: revealBoot }} />
        {children}
      </body>
    </html>
  );
}
