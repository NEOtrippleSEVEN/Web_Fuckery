import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionRuntime from "@/components/motion/MotionRuntime";
import Preloader from "@/components/motion/Preloader";
import { site } from "@/data/site";

// All three faces are subset to the Latin range this site sets — see
// scripts/subset-fonts.mjs. Upstream they totalled 403KB and were the largest
// item on the critical path; subset they are ~61KB.

// Pinned to the single instance the design uses (opsz 144, wght 380) and
// roman only. Nothing may rely on an italic or a second display weight.
const fraunces = localFont({
  src: "../fonts/fraunces-opsz-latin.woff2",
  variable: "--font-fraunces",
  weight: "380",
  style: "normal",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
  adjustFontFallback: false,
});

const geistSans = localFont({
  src: "../fonts/geist-sans-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  style: "normal",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

// Not preloaded: the mono voice only sets small labels and captions, so it
// must not compete for bandwidth with the display face, which is the LCP
// element on every page.
const geistMono = localFont({
  src: "../fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  style: "normal",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "monospace"],
});

// Runs before first paint: returning visitors and reduced-motion users never
// see the preloader overlay at all.
const loaderSkipScript = `try{if(sessionStorage.getItem("mh-loaded")||matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.loader="skip"}}catch(e){}`;

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Real Estate, Hudson Valley`,
    template: `%s — ${site.name}`,
  },
  description:
    "A small number of exceptional Hudson Valley houses, sold properly. Maren Holt represents buyers and sellers from Beacon to Hudson.",
};

export const viewport: Viewport = {
  themeColor: "#0c120f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: loaderSkipScript }} />
        <noscript>
          <style>{`[data-loader-overlay]{display:none}`}</style>
        </noscript>
        <a href="#main" className="skip-link dossier">
          Skip to content
        </a>
        <Preloader />
        <MotionRuntime />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
