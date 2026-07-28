"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, prefersReducedMotion } from "@/lib/motion.config";
import { getLenis } from "@/components/motion/MotionProvider";
import { LOADER_KEY, READY_EVENT, VIEWING_KEY } from "@/lib/motion.flags";

gsap.registerPlugin(ScrollTrigger);

export default function Choreographer() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let ctx: gsap.Context | undefined;

    const setup = () => {
      ctx = gsap.context(() => {
        // Arrivals via the Viewing keep their hero — the image is already on screen.
        const viaViewing = sessionStorage.getItem(VIEWING_KEY) === pathname;
        if (viaViewing) sessionStorage.removeItem(VIEWING_KEY);

        // Hero intro: masked lift for title, meta, and the showing line.
        const heroBits = gsap.utils.toArray<HTMLElement>(
          "[data-hero-title], [data-hero-meta], [data-hero-showing]"
        );
        if (heroBits.length && !viaViewing) {
          gsap.fromTo(
            heroBits,
            { autoAlpha: 0, y: 42 },
            { autoAlpha: 1, y: 0, duration: DUR.slow, ease: EASE.out, stagger: 0.12, delay: 0.15 }
          );
        }

        // Scroll reveals — one batched system for the whole page.
        const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        if (reveals.length) {
          gsap.set(reveals, { autoAlpha: 0, y: 28 });
          ScrollTrigger.batch(reveals, {
            start: "top 88%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: DUR.base,
                ease: EASE.out,
                stagger: 0.08,
                overwrite: true,
              }),
          });
        }

        // Photography drifts slower than the page — depth without decoration.
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
          const frame = img.parentElement;
          if (!frame) return;
          gsap.fromTo(
            img,
            { yPercent: -7, scale: 1.14 },
            {
              yPercent: 7,
              scale: 1.14,
              ease: "none", // scroll position is the easing
              scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });

        // Home hero: content lifts away faster than the image as you leave.
        const hero = document.querySelector<HTMLElement>("[data-hero]");
        if (hero) {
          const shell = hero.querySelector<HTMLElement>(".shell");
          const image = hero.querySelector<HTMLElement>("[data-hero-img]");
          const drift = gsap.timeline({
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
          if (shell) drift.to(shell, { yPercent: -24, autoAlpha: 0.15, ease: "none" }, 0);
          if (image) drift.to(image, { yPercent: 12, ease: "none" }, 0);
        }
      });
      ScrollTrigger.refresh();
    };

    // Land route changes at the top before anything plays.
    getLenis()?.scrollTo(0, { immediate: true });

    // First visit waits for the preloader's release; everything else runs now.
    const loaderPending =
      typeof sessionStorage !== "undefined" && !sessionStorage.getItem(LOADER_KEY);
    if (loaderPending) {
      window.addEventListener(READY_EVENT, setup, { once: true });
    } else {
      setup();
    }

    return () => {
      window.removeEventListener(READY_EVENT, setup);
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
