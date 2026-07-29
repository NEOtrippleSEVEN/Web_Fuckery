// The entire motion runtime — gsap, ScrollTrigger, Lenis, preloader,
// choreography, and the Viewing — lives in this async chunk so the initial
// bundle stays inside the 200KB budget. Loaded by MotionRuntime right after
// hydration; the page is fully usable without it.
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, prefersReducedMotion } from "@/lib/motion.config";
import { LOADER_KEY, READY_EVENT, VIEWING_KEY } from "@/lib/motion.flags";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let booted = false;
let navigate: (href: string) => void = () => {};
let viewingOverlay: HTMLDivElement | null = null;
let pendingViewingPath: string | null = null;
let viewingWatchdog = 0;

// The overlay is opaque and Lenis is stopped while it is up, so every exit
// path has to come through here — a stranded overlay reads as a frozen page.
function releaseViewing() {
  const overlay = viewingOverlay;
  pendingViewingPath = null;
  if (viewingWatchdog) {
    window.clearTimeout(viewingWatchdog);
    viewingWatchdog = 0;
  }
  if (!overlay) return;
  viewingOverlay = null;
  gsap.to(overlay, {
    autoAlpha: 0,
    duration: DUR.base,
    ease: EASE.base,
    onComplete: () => {
      overlay.remove();
      lenis?.start();
    },
  });
}

const releaseLoader = () => {
  sessionStorage.setItem(LOADER_KEY, "1");
  window.dispatchEvent(new Event(READY_EVENT));
};

function startPreloader() {
  const root = document.querySelector<HTMLDivElement>("[data-loader-overlay]");
  if (
    !root ||
    document.documentElement.dataset.loader === "skip" ||
    prefersReducedMotion() ||
    sessionStorage.getItem(LOADER_KEY)
  ) {
    root?.remove();
    releaseLoader();
    return;
  }

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    releaseLoader();
    gsap.to(root, {
      yPercent: -100,
      duration: DUR.slow,
      ease: EASE.base,
      onComplete: () => root.remove(),
    });
  };

  // The overlay is server-rendered and on screen from first paint, but this
  // code only runs once the motion chunk lands — which is deliberately after
  // load + idle. So the budget has to be measured from navigation start, not
  // from here, or a slow chunk silently turns a 3s cap into a 5s one.
  const elapsed = performance.now();
  const LIFT_BY = 2000; // begin the lift by here; the lift itself reveals the page
  const HARD_STOP = 3000; // absolute cap, whatever else has happened
  const runway = Math.max(0.35, (LIFT_BY - elapsed) / 1000);

  const count = { n: 0 };
  const counter = root.querySelector("[data-loader-count]");
  const tl = gsap.timeline({ onComplete: finish });
  tl.fromTo(
    "[data-loader-mark]",
    { autoAlpha: 0, y: 24 },
    { autoAlpha: 1, y: 0, duration: Math.min(DUR.base, runway * 0.45), ease: EASE.out }
  )
    .to(
      count,
      {
        n: 100,
        duration: runway,
        ease: EASE.out,
        onUpdate: () => {
          if (counter) counter.textContent = String(Math.round(count.n)).padStart(3, "0");
        },
      },
      "<"
    )
    .fromTo("[data-loader-line]", { scaleX: 0 }, { scaleX: 1, duration: runway, ease: EASE.out }, "<");

  // Never trap the user behind the overlay, even if the timeline never runs.
  window.setTimeout(finish, Math.max(200, HARD_STOP - elapsed));
}

function startLenis() {
  if (prefersReducedMotion()) return;
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// The signature. Capture phase so we outrun Next's Link handler.
function startViewing() {
  const onClick = (event: MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
      return;
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[data-viewing]");
    if (!anchor || prefersReducedMotion()) return;

    // A Viewing is already in flight. Swallow the click rather than returning:
    // letting it through hands the same href to the router a second time, the
    // route commits before onComplete sets pendingViewingPath, and the overlay
    // is then never settled — a double-click would freeze the page.
    if (viewingOverlay) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const img = anchor.querySelector("img");
    if (!img || !img.complete) return;

    event.preventDefault();
    event.stopPropagation();
    const href = anchor.getAttribute("href") ?? "/properties";
    const rect = img.getBoundingClientRect();
    const vw = window.innerWidth;
    const targetH = window.innerHeight * 0.82; // detail hero: min-h-[82svh]

    lenis?.stop();

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
    viewingOverlay = overlay;

    // FLIP with counter-scale — transform and opacity only.
    const sx = vw / rect.width;
    const sy = targetH / rect.height;
    const uniform = Math.max(sx, sy);

    gsap
      .timeline({
        onComplete: () => {
          sessionStorage.setItem(VIEWING_KEY, href);
          pendingViewingPath = href;
          // If that route never commits — failed chunk, blocked push, already
          // there — nothing else would ever take the overlay down.
          viewingWatchdog = window.setTimeout(releaseViewing, 2500);
          navigate(href);
        },
      })
      .to(backdrop, { opacity: 1, duration: DUR.slow * 0.7, ease: EASE.base }, 0)
      .to(
        frame,
        { x: -rect.left, y: -rect.top, scaleX: sx, scaleY: sy, duration: DUR.slow, ease: EASE.base },
        0
      )
      .to(
        photo,
        { scaleX: uniform / sx, scaleY: uniform / sy, duration: DUR.slow, ease: EASE.base },
        0
      );
  };
  document.addEventListener("click", onClick, true);
}

// Called on every route commit: settle the Viewing overlay if one is up.
function settleViewing(pathname: string) {
  if (!pendingViewingPath || pathname !== pendingViewingPath || !viewingOverlay) return;
  pendingViewingPath = null;
  if (viewingWatchdog) {
    window.clearTimeout(viewingWatchdog);
    viewingWatchdog = 0;
  }

  // Hold until the destination hero has actually painted, so the overlay never
  // uncovers a blank hero — but never hold longer than the cap.
  const started = performance.now();
  const waitForHero = () => {
    const hero = document.querySelector<HTMLImageElement>("[data-viewing-target]");
    const painted = hero?.complete && hero.naturalWidth > 0;
    if (painted || performance.now() - started > 2000) {
      window.setTimeout(releaseViewing, 120);
    } else {
      requestAnimationFrame(waitForHero);
    }
  };
  waitForHero();
}

export function boot(nav: (href: string) => void) {
  navigate = nav;
  if (booted) return;
  booted = true;
  if (prefersReducedMotion()) {
    document.querySelector("[data-loader-overlay]")?.remove();
    releaseLoader();
    return;
  }
  startLenis();
  startPreloader();
  startViewing();
}

// Per-page choreography. Returns a cleanup for the route change.
export function route(pathname: string): () => void {
  if (prefersReducedMotion()) return () => {};

  settleViewing(pathname);
  lenis?.scrollTo(0, { immediate: true });

  let ctx: gsap.Context | undefined;

  const setup = () => {
    ctx = gsap.context(() => {
      const viaViewing = sessionStorage.getItem(VIEWING_KEY) === pathname;
      if (viaViewing) sessionStorage.removeItem(VIEWING_KEY);

      // Transform-only lift: no opacity on the headline, so its first paint
      // (not the reveal) is the LCP record.
      const heroBits = gsap.utils.toArray<HTMLElement>(
        "[data-hero-title], [data-hero-meta], [data-hero-showing]"
      );
      if (heroBits.length && !viaViewing) {
        gsap.fromTo(
          heroBits,
          { y: 64 },
          { y: 0, duration: DUR.slow, ease: EASE.out, stagger: 0.12, delay: 0.15 }
        );
      }

      // Reveals: skip anything already on screen (no flicker on return visits,
      // nothing above the fold dips out after the async chunk lands).
      const fold = window.innerHeight * 0.92;
      const reveals = gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .filter((el) => el.getBoundingClientRect().top > fold);
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

      // Photography drifts slower than the page.
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

  const loaderPending = !sessionStorage.getItem(LOADER_KEY);
  if (loaderPending) {
    window.addEventListener(READY_EVENT, setup, { once: true });
  } else {
    setup();
  }

  return () => {
    window.removeEventListener(READY_EVENT, setup);
    ctx?.revert();
  };
}
