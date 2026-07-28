"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { DUR, EASE, prefersReducedMotion } from "@/lib/motion.config";
import { LOADER_KEY, READY_EVENT } from "@/lib/motion.flags";
import { site } from "@/data/site";

// A pre-hydration inline script (see layout) sets html[data-loader="skip"] for
// return visits and reduced motion, so the overlay never paints in those cases.
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const release = () => {
      sessionStorage.setItem(LOADER_KEY, "1");
      window.dispatchEvent(new Event(READY_EVENT));
    };

    if (
      document.documentElement.dataset.loader === "skip" ||
      prefersReducedMotion() ||
      sessionStorage.getItem(LOADER_KEY)
    ) {
      rootRef.current?.remove();
      release();
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      release();
      gsap.to(root, {
        yPercent: -100,
        duration: DUR.slow,
        ease: EASE.base,
        onComplete: () => root.remove(),
      });
    };

    const count = { n: 0 };
    const counter = root.querySelector("[data-loader-count]");
    const line = root.querySelector("[data-loader-line]");
    const tl = gsap.timeline({ onComplete: finish });
    tl.fromTo(
      "[data-loader-mark]",
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: DUR.base, ease: EASE.out }
    )
      .to(
        count,
        {
          n: 100,
          duration: 1.6,
          ease: EASE.out,
          onUpdate: () => {
            if (counter) counter.textContent = String(Math.round(count.n)).padStart(3, "0");
          },
        },
        "<"
      )
      .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: EASE.out }, "<")
      .to({}, { duration: 0.4 }); // settle beat — min display ≈ 2s

    // Never trap the user: hard dismiss at 3s regardless of asset state.
    const hardStop = window.setTimeout(finish, 3000);

    return () => {
      window.clearTimeout(hardStop);
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-loader-overlay
      aria-hidden="true"
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-evergreen"
    >
      <div data-loader-mark className="text-center opacity-0">
        <p className="font-display type-h1 text-limestone">{site.name}</p>
        <p className="eyebrow mt-3 text-fog">{site.region.toUpperCase()}</p>
      </div>
      <p
        data-loader-count
        className="dossier absolute right-[var(--gutter)] bottom-8 text-fog"
      >
        000
      </p>
      <div
        data-loader-line
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-brass"
      />
    </div>
  );
}
