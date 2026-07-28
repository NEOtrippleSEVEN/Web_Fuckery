import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionRuntime from "@/components/motion/MotionRuntime";
import Preloader from "@/components/motion/Preloader";
import { site } from "@/data/site";

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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full`}>
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
