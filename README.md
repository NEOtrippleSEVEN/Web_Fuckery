# Maren Holt — Hudson Valley real estate

A motion-driven marketing site for a residential real estate agent, built to the
process in `CLAUDE.md`. The brand, the copy, the six listings, and the reviews are
**placeholder** — invented for the build. See "What is real and what is not" below
before showing this to anyone.

Design direction (palette, type, layout, signature element) is in
[`docs/DIRECTION.md`](docs/DIRECTION.md).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # runs the photography prebuild, then next build
```

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · GSAP + ScrollTrigger · Lenis

## Structure

| Path | What it is |
|---|---|
| `src/app` | Routes: home, properties index, `properties/[slug]`, about, contact, 404 |
| `src/data` | All content — `properties.ts`, `reviews.ts`, `site.ts`, and the image manifest |
| `src/lib/motion.config.ts` | **The one easing curve and duration scale.** Import from here; never inline a curve |
| `src/lib/motion-core.ts` | The whole motion runtime, loaded as an async chunk after hydration |
| `src/components/motion` | `MotionRuntime` (thin loader) and the server-rendered preloader markup |
| `scripts/` | Placeholder art, font subsetting, photography fetch, and the test harnesses |

To rebrand: edit `src/data/site.ts` and the palette block at the top of
`src/app/globals.css`. Nothing else hardcodes the identity.

## Motion

One curve (`power3`) and one duration scale site-wide, both from
`src/lib/motion.config.ts`. Everything scroll-linked animates `transform` and
`opacity` only, and scrubbed tweens use `ease: "none"` so the scroll position is
the easing.

The signature element is **the Viewing**: clicking a listing does not navigate,
it enters. The card's photograph expands from its own geometry to the detail
page's hero, the route swaps underneath, and the overlay releases once the hero
has actually painted. It is a FLIP with a counter-scaled inner image, so the
photo never distorts while its frame changes aspect.

`prefers-reduced-motion: reduce` disables Lenis and every animation, and the
preloader never paints. Because all hidden states are set in JavaScript, the
page is fully readable if the motion chunk never loads.

## Performance

Measured on the production build, Lighthouse mobile with simulated throttling
(median of three runs, on a shared container — treat as indicative, not a lab
result):

| Metric | Budget | Measured |
|---|---|---|
| Performance | ≥ 85 | 97 |
| LCP | < 2.5s | 2.2s |
| CLS | < 0.1 | 0 |
| Initial JS | < 200KB gz | 190KB gz |
| Fonts | — | 61KB (from 403KB) |

Two things carry most of that:

**Fonts are subset** to the Latin range this site actually sets
(`npm run subset-fonts`, needs `pip3 install fonttools brotli`). Fraunces is
additionally *pinned* to the single instance the design uses — optical size 144,
weight 380 — because nothing varies it. **If you want a second display weight, an
italic, or a different optical size, you must re-run the subsetting script**; the
shipped file physically does not contain them. Geist Mono is deliberately not
preloaded: it only sets small labels and must not compete with the display face,
which is the LCP element on every page.

**The motion runtime is an async chunk.** GSAP, ScrollTrigger, and Lenis load
after `load` plus an idle callback, which keeps them off the critical path.

## What is real and what is not

Per the spec's asset table, a build cannot produce photography. So:

- `public/images/*.webp` are **art-directed placeholders** — seeded SVG dusk-scapes
  rasterised by `npm run placeholders`. They are meant to read as intentional
  colour studies, not to be mistaken for photographs of houses.
- `scripts/photography.json` lists generated photographs for some slots. The
  `prebuild` step fetches them and swaps them in **wherever the build host has
  outbound network access**. Where it cannot reach them it logs
  `kept placeholder` and ships the art. Check that line in your build log — if
  every slot says `kept placeholder`, you are looking at the art, not the photos.
- Those URLs point at a generation CDN and **may expire**. Replacing them with
  real photography — dropped into `public/images` under the same filenames — is
  the intended endpoint. Nothing else has to change.

Still needs a human: the concept, real photography, real copy, the brand, and
the licence numbers and address on the contact page and footer, which are invented.

## Testing

```bash
npm run build && npm start -- -p 3100
node scripts/motion-test.mjs        # reveals fire; reduced motion hides nothing
node scripts/signature-test.mjs     # preloader dismisses; the Viewing lands
node scripts/shot.mjs               # screenshots, desktop + mobile + 320px
```

These drive the pre-installed Chromium via `playwright-core` and expect the site
on port 3100; change the URL at the top of each script if you run elsewhere.
