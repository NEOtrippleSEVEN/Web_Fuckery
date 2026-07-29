# Direction — Maren Holt, Real Estate

Multi-page marketing site for a residential real estate agent. Placeholder identity:
**Maren Holt, Hudson Valley NY**. Everything here is swappable when the real brand arrives.

Concept in one line: **a private viewing, not a listings portal** — photography runs
full-bleed and unhurried; type annotates in the margins like a well-set property dossier.

---

## Palette

| Name | Hex | Role |
|---|---|---|
| Evergreen | `#0C120F` | Base background (deep green-black, never pure black) |
| Cedar | `#161E19` | Raised dark surfaces, cards on dark |
| Parchment | `#F5F2E9` | Light section background |
| Limestone | `#EDE8DD` | Text on dark, borders on light |
| Fog | `#8B958D` | Muted text, captions, rules |
| Brass | `#B4915A` | **The accent.** Every interactive element. No second accent, ever. |

Accent usage rule: brass passes AA on evergreen (≈6.2:1) — fine for links and UI text on
dark. On parchment it fails for body text (≈2.4:1), so on light sections brass appears only
at display size, in underlines, and on icons; interactive body text on light uses evergreen
with a brass underline.

## Type

| Role | Face | Use |
|---|---|---|
| Display | **Fraunces**, optical size 144, weight 380, roman | Headlines, nameplate, prices, review quotes. With restraint — never below 28px. |
| Body | **Geist Sans** (400 / 500) | Paragraphs, navigation, UI. |
| Utility | **Geist Mono** (400) | The dossier voice: beds/baths/sqft schedules, captions, labels, review metadata. |

All open-source, all self-hosted and subset — zero external font requests, 61KB total.

**As-built note (performance pass).** The display face ships *pinned* to that one
instance rather than as a variable font, because nothing in the design varies it —
that is what took it from 66KB to 16KB. The italic went with it: an earlier draft
set the review quotes in Fraunces italic, and the italic file alone was 81KB on the
critical path, so the quotes are roman. Adding a second display weight, an italic,
or a different optical size is a real change: re-run `npm run subset-fonts` after
editing `scripts/subset-fonts.mjs`, and re-check LCP.

## Layout

One sentence: photography owns the full viewport width; text sits in a strict 12-column
grid with wide margins, and every property is presented as a dossier — image first,
schedule of facts in mono, prose last.

Hero (home):

```
┌────────────────────────────────────────────────────────┐
│  MAREN HOLT                          Properties  About │
│                                              Contact ─ │
│                                                        │
│              [ full-bleed dusk photograph ]            │
│                                                        │
│   Houses worth                                         │
│   slowing down for.            HUDSON VALLEY · NY      │
│                                EST. 2012 · LIC. RE-... │
│                                                        │
│   ── Currently showing: Thornfield House →             │
└────────────────────────────────────────────────────────┘
```

Interior section (portfolio strip, home + properties index):

```
┌────────────────────────────────────────────────────────┐
│   ON THE MARKET                                        │
│                                                        │
│  ┌──────────────┐   THORNFIELD HOUSE                   │
│  │              │   Rhinebeck, NY                      │
│  │   photo      │   5 BD · 4 BA · 6,200 SQFT · 14 AC   │
│  │              │   $4,850,000                         │
│  └──────────────┘                                      │
│                                                        │
│                       ┌──────────────┐  THE GLASSWING  │
│                       │    photo     │  Cold Spring    │
│                       └──────────────┘  ...            │
└────────────────────────────────────────────────────────┘
```

Pages: Home · Properties (index) · Property detail (template, 6 listings) · About · Contact.
404 designed. Reviews live as sections on Home and About, not a separate page.

## Signature

**The Viewing.** Clicking a property doesn't navigate — it *enters*: the listing's
photograph expands from its card to consume the entire viewport, then settles as the
detail page's hero. One uninterrupted move, like a door opening. A stranger describes the
site as "the one where clicking a house swallows the screen and you're inside."

Everything else stays quiet in support: reveals are simple masked lifts, hovers are
restrained, no scattered effects competing with the one move.

---

## Self-critique gate (§02)

Checked against the cliché list:

- ~~Cream bg + high-contrast serif + terracotta~~ — rejected; base is deep evergreen, accent is brass, light sections are parchment used sparingly.
- ~~Near-black + acid green / vermilion~~ — base is green-black by intent (landed, arboreal, not "tech dark mode"), and the accent is a low-saturation metal, not a neon.
- ~~Broadsheet hairlines / zero radius / dense columns~~ — layout is airy, 2px radius on interactive elements, wide margins per the anti-reference ("not enough white space").
- ~~Numbered section markers~~ — none. The only sequence on the site is the selling process on About, which is genuinely ordered and is the one place numbers appear.
- ~~Gradient-on-dark hero with big number + small label~~ — hero is a photograph with a typographic nameplate; no gradients, no stat theatre.

Boldness is spent in exactly one place: the Viewing transition. Chanel rule applied —
an earlier draft had a marquee ticker of sold addresses; removed.

## Decisions flagged (proceeding per §10.4)

1. **No 3D / no frame-scrubbing** — user has no assets (§01.14). Heavy appetite is delivered via choreography + the signature transition + parallax photography.
2. **Preloader: yes** — image-heavy site justifies it. 2s minimum, 3s hard dismiss, sessionStorage skip for return visits.
3. **Placeholder photography will be generated** — brief demands "heavily visual" with zero assets. Aim is photorealistic architectural placeholder with one consistent grade (dusk, deep greens); if quality lands anywhere near "AI slop" (the anti-reference), the fallback is art-directed duotone stills, not bad renders.
4. **Copy is placeholder** but written for real (§04): active voice, specific, sentence case, no banned vocabulary.
