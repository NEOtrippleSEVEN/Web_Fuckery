# Agency-Tier Website Build Spec

**Purpose:** Operating instructions for Claude Code / Claude Design when building a high-craft, motion-driven marketing site. Paste this in as `CLAUDE.md` or a project skill. It is a *process*, not a template.

---

## 00 — Scope reality (read first, do not skip)

This spec produces **agency-tier execution**. It does not produce **awards** on its own. The difference matters:

| Achievable from this spec | Requires a human decision or external asset |
|---|---|
| Motion system, timing, easing consistency | The concept — the idea that makes the site memorable |
| Scroll choreography, pinning, scrubbing | 3D models, rendered frame sequences, video |
| Canvas image-sequence scrubbers | Photography, real brand assets, licensed type |
| Performance budget compliance | Copywriting that carries a voice |
| Accessibility floor, responsive behaviour | Taste calls between two equally valid directions |

Awwwards-tier sites win on **originality of concept**. A template is by definition not original. What this spec guarantees is that the *craft floor* is high enough that the concept has somewhere to land — no jank, no mobile collapse, no mismatched easing, no default-AI look.

**Rule for the agent:** never claim a build is "award-winning." State what was built and what still needs a human call.

---

## 01 — The intake interview

Before writing a single line, run this interview. Ask in **batches, not one at a time.** Wait for answers. Do not assume defaults.

### Batch A — The brief (blocking, cannot proceed without)

1. **What is this site for?** Product, studio portfolio, brand campaign, event, SaaS landing, editorial.
2. **What is the single job of the homepage?** One sentence. "Get a demo booked." "Make you believe this brand is expensive." "Get an email address."
3. **Who is looking at it?** Be specific — not "everyone."
4. **What is the one thing a visitor must remember 10 minutes after leaving?**
5. **Name 2–3 reference sites and say what specifically you like about each.** Structure? Type? Motion? Colour? *"I like the feel"* is not an answer — push back and get specifics.
6. **What must NOT be on this site?** Anti-references are more useful than references.

### Batch B — Constraints (blocking)

7. **Framework:** Next.js (App Router) / Astro / Vite+React / plain Vite? Default → Next.js unless told otherwise.
8. **Deploy target:** Vercel / Netlify / static host / client's own infra.
9. **CMS or static content?** If CMS, which.
10. **Real content ready, or placeholder?** If placeholder, the agent writes the copy — see §04.
11. **Mobile traffic share.** If >50%, the 3D budget drops hard (see §05).
12. **Timeline / scope ceiling.** One-page scroller vs multi-page site changes everything.

### Batch C — Motion & 3D appetite (blocking for §05)

13. **Motion level:**
    - `subtle` — reveals, hover states, smooth scroll only
    - `choreographed` — pinned sections, scrubbed timelines, orchestrated load
    - `heavy` — 3D scene, image-sequence scrubber, cinematic intro
14. **Do you have 3D assets or the ability to make them?** (Blender / Spline / AI video output). If **no**, real-time 3D and image-sequence scrubbing are both off the table — say so immediately and propose CSS/SVG/canvas alternatives instead of faking it.
15. **Is a preloader wanted, or does it read as pretentious for this brand?**

### Batch D — Brand (blocking for §03)

16. **Existing brand:** logo, palette, typefaces, tone-of-voice doc? Attach them.
17. **If no brand:** what feeling? Give 3 adjectives that are not "modern," "clean," or "premium."
18. **Licensed fonts available, or open-source only?**

**After the interview:** restate the brief back in 5 lines and get a yes before proceeding. Cheap to correct now, expensive later.

---

## 02 — Mandatory design direction pass

**Do not write code until this is written out and approved.** This is the step that separates agency work from a component dump.

Produce a short direction doc containing exactly four things:

**Palette** — 4–6 named hex values. One accent, used for every interactive element. Never a second accent.

**Type** — 2–3 roles: a display face used with restraint, a body face, optionally a utility/mono face for captions and data. Deliberate pairing, not the same two faces used on every project.

**Layout** — one-sentence concept plus an ASCII wireframe of the hero and one interior section.

**Signature** — the *one* element this site is remembered by. One. Everything else stays quiet in support of it.

### Self-critique gate

Before approval, check the direction against the current AI-design clichés. If it matches any of these, it was a default, not a choice — revise and say what changed:

- Cream/off-white background + high-contrast serif + terracotta accent
- Near-black background + one acid-green or vermilion accent
- Broadsheet layout, hairline rules, zero border-radius, dense columns
- `01 / 02 / 03` numbered section markers used where the content is not actually a sequence
- Gradient-on-dark hero with a big number and a small label

Numbered markers are only legitimate when order carries real information. Same for eyebrows, dividers, and labels: structure should encode something true, not decorate.

**Spend boldness in one place.** Chanel's rule applies — before shipping, remove one accessory.

---

## 03 — Non-negotiable technical rules

These are hard constraints. The agent does not deviate without flagging it explicitly.

### Motion system

```js
// motion.config.js — single source of truth, imported everywhere
export const EASE = {
  base: 'power3.inOut',   // ONE curve for the whole site
  out:  'power3.out',     // only for entrances
};

export const DUR = {
  fast: 0.3,   // small UI: hovers, buttons, toggles
  base: 0.6,   // component reveals
  slow: 1.1,   // full-section and page transitions
};
```

- **One easing curve** across the entire site. Mixing ease types per section is the single most common tell of an amateur build.
- **Motion speed scales with element size.** Small UI 200–300ms, full-page 800ms–1.2s. Never the reverse.
- **Animate `transform` and `opacity` only.** Animating `top`/`left`/`width`/`height` forces layout recalculation every frame. No exceptions in scroll-linked animation.
- **Batch ScrollTriggers.** Many instances on one page is a performance problem — group related animations into one timeline with a shared trigger.
- **`will-change: transform`** on heavily animated elements only. Applying it globally is worse than not using it — it forces GPU layers for everything and exhausts memory.

### Accessibility floor (not optional)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Plus: visible keyboard focus states, `alt` on all meaningful images, real heading hierarchy, and any scroll-driven content must still be readable if JS fails. Lenis must be disabled under `prefers-reduced-motion`.

### Performance budget

| Metric | Target |
|---|---|
| LCP (mobile) | < 2.5s |
| CLS | < 0.1, aim 0 |
| INP | < 200ms |
| JS bundle (initial) | < 200KB gzipped |
| Largest single 3D asset | < 2MB after Draco |
| Lighthouse perf (mobile) | ≥ 85 |

Budget is checked on **mobile throttled**, not desktop. If a feature blows the budget, the feature changes — not the budget.

---

## 04 — Copy

If content is placeholder, the agent writes it. Copy makes a design feel templated as fast as the design does.

- Active voice. A button says what happens: "Book a call," not "Submit."
- The same action keeps its name through the whole flow. "Publish" → toast says "Published."
- Specific beats clever. Name things by what the user recognises, not by how the system works.
- Errors explain what happened and how to fix it. They don't apologise and they're never vague.
- Empty states are an invitation to act, not a mood.
- Sentence case, no filler, one job per element. A label labels. An example demonstrates.

Banned unless the brief explicitly asks: "Elevate," "Seamless," "Unlock," "Revolutionary," "Next-generation," "Empower," "In today's fast-paced world."

---

## 05 — Pattern library (corrected)

Reference implementations. **These are starting points to adapt, not code to paste.**

### 5.1 Smooth scroll + ScrollTrigger wiring

The foundation. Everything scroll-driven depends on this being correct.

```js
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis;
if (!prefersReduced) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Cleanup on unmount (React/Next — otherwise you leak tickers on route change)
// return () => { gsap.ticker.remove(raf); lenis?.destroy(); ScrollTrigger.killAll(); };
```

**Note:** `lagSmoothing(0)` is required. Without it GSAP tries to compensate for frame drops and fights Lenis.

### 5.2 Pinned section with scrubbed timeline

```js
gsap.timeline({
  scrollTrigger: {
    trigger: '.pin-section',
    start: 'top top',
    end: '+=2000',        // pin duration in scroll px
    pin: true,
    scrub: 1,             // 1 = 1s catch-up smoothing; true = instant
    invalidateOnRefresh: true,
  }
})
  .to('.title', { scale: 0.6, y: -200, ease: 'none' })
  .from('.cards', { opacity: 0, y: 40, stagger: 0.15, ease: 'none' });
```

Inside a `scrub` timeline, use `ease: 'none'` on the tweens — the scroll position *is* the easing. Applying a curve on top makes the animation feel like it's fighting the user's scroll.

### 5.3 Three.js hero — **corrected**

The version in most guides is broken: it uses `MeshStandardMaterial` with no lights (renders black) and never moves the camera off the origin (renders nothing). Working minimum:

```js
import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 3;                      // ← without this you sit inside the mesh

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));   // ← cap DPR, never leave uncapped
document.querySelector('#hero-canvas').appendChild(renderer.domElement);

// MeshStandardMaterial is PBR — it renders black without lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const key = new THREE.DirectionalLight(0xffffff, 1.2);
key.position.set(2, 3, 4);
scene.add(key);

const mesh = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.4, metalness: 0.1 })
);
scene.add(mesh);

let raf;
const clock = new THREE.Clock();
function animate() {
  const dt = clock.getDelta();
  mesh.rotation.y += dt * 0.6;              // ← delta-time, not per-frame constant
  renderer.render(scene, camera);
  raf = requestAnimationFrame(animate);
}
animate();

// Pause offscreen — a hero scene rendering behind the fold is wasted battery
const io = new IntersectionObserver(([e]) =>
  e.isIntersecting ? animate() : cancelAnimationFrame(raf)
);
io.observe(document.querySelector('#hero-canvas'));

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// Dispose on unmount: geometry.dispose(); material.dispose(); renderer.dispose();
```

**Mobile rule:** detect device and drop particle counts / disable post-processing / cap DPR at 1.5. A scene that runs on an M-series Mac is not evidence it runs on a mid-range Android.

### 5.4 Image-sequence scroll scrubber

This is how Apple's product pages actually work — pre-rendered frames scrubbed on a canvas, **not** live 3D. Correct in principle, but the naive version eats memory on mobile:

```js
const canvas = document.querySelector('#seq');
const ctx = canvas.getContext('2d');
const FRAMES = 120;
const images = new Array(FRAMES);
let loaded = 0;

// Load in priority order: first frame, then every 10th, then fill in.
// Prevents a 120-request stampede blocking LCP.
const order = [0, ...Array.from({length: FRAMES}, (_, i) => i).filter(i => i % 10 === 0), 
               ...Array.from({length: FRAMES}, (_, i) => i)];

[...new Set(order)].forEach((i, idx) => {
  const img = new Image();
  img.decoding = 'async';
  img.fetchPriority = idx < 12 ? 'high' : 'low';
  img.src = `/frames/frame_${String(i).padStart(4, '0')}.webp`;
  img.onload = () => { loaded++; if (i === 0) render(0); };
  images[i] = img;
});

function render(index) {
  const img = images[index];
  if (!img?.complete) return;                 // skip un-decoded frames, don't blank the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

const proxy = { frame: 0 };
gsap.to(proxy, {
  frame: FRAMES - 1,
  snap: 'frame',
  ease: 'none',
  scrollTrigger: {
    trigger: '.seq-section',
    start: 'top top',
    end: '+=3000',
    pin: true,
    scrub: 0.5,
  },
  onUpdate: () => render(Math.round(proxy.frame)),
});
```

**Reality check on this technique:** it is *cheap to play back* but not free to load. 120 full-res WebPs is real bandwidth and real decode memory. Rules:

- Ship **two frame sets** — desktop (1920w) and mobile (960w or fewer frames, e.g. 60).
- Target **< 80KB per frame** after WebP compression. 120 × 80KB = 9.6MB total. Acceptable behind the fold, not in the hero.
- Set explicit `width`/`height` on the canvas to avoid CLS.
- If frame count > 150, switch to a scrubbed `<video>` with `requestVideoFrameCallback` instead.

### 5.5 Preloader

Only build this if Batch C question 15 said yes. A preloader on a site with 400KB of assets is a lie the user can feel.

```js
gsap.timeline()
  .to('.loader-count', { textContent: 100, duration: 1.8, snap: { textContent: 1 }, ease: 'power2.out' })
  .to('.loader-overlay', { yPercent: -100, duration: DUR.slow, ease: EASE.base }, '+=0.2')
  .from('.hero-content > *', { yPercent: 110, stagger: 0.08, ease: EASE.out }, '<0.3');
```

Enforce a **minimum display of ~2s** so it never flashes, and a **hard maximum of 3s** with a forced dismiss — never let a failed asset load trap the user behind an overlay. Store a `sessionStorage` flag so returning visitors skip it.

---

## 06 — Build sequence

Work in this order. Do not jump ahead — each phase depends on the last being stable.

1. **Interview** (§01) → restate brief → get approval.
2. **Direction doc** (§02) → self-critique gate → get approval.
3. **Static build.** Full page, real content, correct type and spacing, **zero animation.** The site must look good frozen. If it only works in motion, the design is weak.
4. **Motion config.** Wire `motion.config.js`, Lenis, ScrollTrigger, reduced-motion guard.
5. **Choreography.** Add reveals and pinning section by section. Test each before adding the next.
6. **Signature element.** The one thing from §02. Build it last so it gets full attention, not leftovers.
7. **Performance pass.** §03 budget, mobile-throttled.
8. **QA gate** (§07).

**Checkpoint after phase 3 and phase 6.** Show the work, take feedback, then continue.

---

## 07 — Definition of done

Ship only when every line passes:

**Performance**
- [ ] Lighthouse mobile (throttled) ≥ 85 performance
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms on mobile
- [ ] Tested on a real mid-range device — iPhone SE or a €300 Android, not the dev machine
- [ ] All GLTF/GLB Draco-compressed; textures WebP/AVIF; no texture over 2048px unless justified
- [ ] No animation of `top`/`left`/`width`/`height` anywhere in a scroll handler
- [ ] Offscreen canvases and 3D scenes pause via IntersectionObserver

**Motion**
- [ ] One easing curve site-wide, imported from config
- [ ] Duration scale respected — small fast, large slow
- [ ] `prefers-reduced-motion` fully honoured, including Lenis disabled
- [ ] No layout shift when animations initialise
- [ ] Scrub timelines use `ease: 'none'` on child tweens

**Design**
- [ ] One accent colour, zero exceptions
- [ ] Signature element is identifiable — a stranger can name it in one sentence
- [ ] Direction doc passed the cliché check in §02
- [ ] Type scale is deliberate, not browser defaults with size overrides

**Basics**
- [ ] Keyboard navigable, focus visible
- [ ] Works at 320px width
- [ ] Video backgrounds: `muted`, `playsinline`, `preload="none"`, poster frame set
- [ ] Cleanup on unmount — no leaked tickers, observers, or WebGL contexts on route change
- [ ] 404 and error states designed, not defaults

---

## 08 — Assets the agent cannot produce

State these to the user at interview time, not at build time. Missing any of them changes what is buildable:

| Asset | Why it can't be generated in-build | Where it comes from |
|---|---|---|
| 3D models (GLB/GLTF) | Requires modelling software | Blender, Spline, Sketchfab, commissioned |
| Rendered frame sequences | Requires a render pipeline | Blender/Spline export, or AI video → ffmpeg frame extract |
| Product photography | Requires the physical product | Shoot, or client-supplied |
| Background video | Requires filming or licensing | Shoot, stock, or AI video tool |
| Licensed display typefaces | Licensing | Foundry purchase, or open-source substitute |
| Brand logo files | Client property | Client |

**If the user has none of these:** say so plainly and propose what's achievable without them — CSS/SVG-driven motion, typographic heroes, canvas generative work, shader backgrounds. These can be excellent. What is not acceptable is silently substituting a grey placeholder cube and calling the build finished.

For frame extraction from an existing video:

```bash
# Every 2nd frame, 1920px wide, WebP q80 — typical hero sequence prep
ffmpeg -i source.mp4 -vf "select=not(mod(n\,2)),scale=1920:-1" \
  -vsync vfr -q:v 80 frames/frame_%04d.webp

# Mobile set
ffmpeg -i source.mp4 -vf "select=not(mod(n\,4)),scale=960:-1" \
  -vsync vfr -q:v 75 frames-mobile/frame_%04d.webp
```

---

## 09 — Failure modes to watch for

The specific ways this kind of build goes wrong:

- **Motion covering for weak layout.** If phase 3 (static) doesn't look good, adding GSAP won't fix it. Go back.
- **Scattered effects instead of one orchestrated moment.** Five small animations read as AI-generated. One well-directed sequence reads as designed.
- **Stack-first thinking.** Reaching for Three.js because the doc mentions it, when the brief needed type and space. Tool follows brief.
- **Desktop-only validation.** Every one of these builds that fails, fails on a phone.
- **Second accent colour creeping in.** Usually arrives via a "success" green or a hover state. Kill it.
- **Preloader theatre.** A 2.5s loader on a 300KB site is a tell, not craft.
- **Unbounded scroll distance.** `end: '+=5000'` on a section with 3 seconds of content makes the user scroll through nothing.

---

## 10 — Agent operating rules

1. **Interview before building. Always.** Even when the request seems obvious.
2. **Direction doc before code. Always.** Even under time pressure.
3. **Ask in batches, not one question at a time.**
4. **State assumptions inline** when proceeding without an answer — don't silently pick.
5. **Never claim award quality.** Report what was built and what needs a human call.
6. **Flag when the brief and the stack disagree.** If someone asks for heavy 3D on a site with 80% mobile traffic, say so before building it.
7. **Push back on vague references.** "I like the feel of X" → "which part — the type, the motion, or the colour?"
