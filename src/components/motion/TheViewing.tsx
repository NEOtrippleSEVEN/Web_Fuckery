"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { DUR, EASE, prefersReducedMotion } from "@/lib/motion.config";
import { VIEWING_KEY } from "@/lib/motion.flags";
import { getLenis } from "@/components/motion/MotionProvider";

// The signature: clicking a listing doesn't navigate — it enters. The card's
// photograph expands to the detail hero's geometry in one move, the route
// swaps underneath, and the overlay lets go.
export default function TheViewing() {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const pendingPath = useRef<string | null>(null);

  // Route committed: hold until the detail hero has painted, then let go.
  useEffect(() => {
    if (!pendingPath.current || pathname !== pendingPath.current) return;
    const overlay = overlayRef.current;
    pendingPath.current = null;
    if (!overlay) return;

    let cancelled = false;
    const release = () => {
      if (cancelled) return;
      gsap.to(overlay, {
        autoAlpha: 0,
        duration: DUR.base,
        ease: EASE.base,
        onComplete: () => {
          overlay.remove();
          overlayRef.current = null;
          getLenis()?.start();
        },
      });
    };

    const started = performance.now();
    const waitForHero = () => {
      if (cancelled) return;
      const hero = document.querySelector<HTMLImageElement>("[data-viewing-target]");
      const painted = hero?.complete && hero.naturalWidth > 0;
      if (painted || performance.now() - started > 2000) {
        window.setTimeout(release, 120);
      } else {
        requestAnimationFrame(waitForHero);
      }
    };
    waitForHero();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    // Capture phase: claim the click before Next's Link handler navigates.
    const onClick = (event: MouseEvent) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
        return;
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[data-viewing]");
      if (!anchor || prefersReducedMotion() || overlayRef.current) return;
      const img = anchor.querySelector("img");
      if (!img || !img.complete) return;

      event.preventDefault();
      event.stopPropagation();
      const slug = anchor.getAttribute("data-viewing");
      const href = anchor.getAttribute("href") ?? `/properties/${slug}`;
      const rect = img.getBoundingClientRect();
      const vw = window.innerWidth;
      const targetH = window.innerHeight * 0.82; // detail hero: min-h-[82svh]

      getLenis()?.stop();

      const overlay = document.createElement("div");
      overlay.setAttribute("data-viewing-overlay", "");
      overlay.style.cssText = "position:fixed;inset:0;z-index:70;pointer-events:none;";

      const backdrop = document.createElement("div");
      backdrop.style.cssText =
        "position:absolute;inset:0;background:var(--color-evergreen);opacity:0;";

      const frame = document.createElement("div");
      frame.style.cssText = `position:absolute;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;overflow:hidden;transform-origin:top left;will-change:transform;`;

      const photo = img.cloneNode() as HTMLImageElement;
      photo.removeAttribute("sizes");
      photo.removeAttribute("srcset");
      photo.src = img.currentSrc || img.src;
      photo.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform-origin:top left;will-change:transform;";

      frame.appendChild(photo);
      overlay.appendChild(backdrop);
      overlay.appendChild(frame);
      document.body.appendChild(overlay);
      overlayRef.current = overlay;

      // FLIP with counter-scale: frame stretches to the hero's box while the
      // photograph rescales uniformly — transform and opacity only.
      const sx = vw / rect.width;
      const sy = targetH / rect.height;
      const uniform = Math.max(sx, sy);

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(VIEWING_KEY, href);
          pendingPath.current = href;
          router.push(href);
        },
      });
      tl.to(backdrop, { opacity: 1, duration: DUR.slow * 0.7, ease: EASE.base }, 0)
        .to(
          frame,
          {
            x: -rect.left,
            y: -rect.top,
            scaleX: sx,
            scaleY: sy,
            duration: DUR.slow,
            ease: EASE.base,
          },
          0
        )
        .to(
          photo,
          {
            scaleX: uniform / sx,
            scaleY: uniform / sy,
            duration: DUR.slow,
            ease: EASE.base,
          },
          0
        );
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
