// Single source of truth for motion. Import from here, never inline curves.
export const EASE = {
  base: "power3.inOut", // the one curve for the whole site
  out: "power3.out", // entrances only
} as const;

export const DUR = {
  fast: 0.3, // small UI: hovers, buttons, toggles
  base: 0.6, // component reveals
  slow: 1.1, // full-section and page transitions
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
