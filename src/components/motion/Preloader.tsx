// Server-rendered overlay markup only — all animation lives in motion-core.
// A pre-paint inline script (see layout) sets html[data-loader="skip"] for
// return visits and reduced motion; CSS removes the overlay before it paints.
// <noscript> hides it entirely when JS is off.
import { site } from "@/data/site";

export default function Preloader() {
  return (
    <div
      data-loader-overlay
      aria-hidden="true"
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-evergreen"
    >
      <div data-loader-mark className="text-center opacity-0">
        <p className="font-display type-h1 text-limestone">{site.name}</p>
        <p className="eyebrow mt-3 text-fog">{site.region.toUpperCase()}</p>
      </div>
      <p data-loader-count className="dossier absolute right-[var(--gutter)] bottom-8 text-fog">
        000
      </p>
      <div
        data-loader-line
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-brass"
      />
    </div>
  );
}
