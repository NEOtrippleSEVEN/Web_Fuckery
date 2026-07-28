"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion.config";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

/** The Viewing and the preloader need to freeze/release scroll. */
export const getLenis = () => lenis;

export default function MotionProvider() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
      ScrollTrigger.killAll();
    };
  }, []);

  return null;
}
