# What we need from the client

Everything required to turn this build from a placeholder into their site. The
character counts are not arbitrary — they are measured from the content this
design is currently holding, so copy written to them will fit without the layout
being renegotiated.

Send it however is easiest; the **Format** column is what matters, not the
delivery mechanism. A shared folder with the four files named below is ideal.

---

## 0. The four questions only they can answer

These are blocking. Different answers produce materially different work, and no
amount of asset-gathering substitutes for them.

1. **What is the single job of the homepage?** One sentence. "Get a valuation
   booked" and "make you believe this agent is expensive" are different sites.
2. **Who is looking at it?** Not "buyers and sellers" — the actual person.
   Downsizing local, weekending New Yorker, and relocating family want different
   things in the first screen.
3. **What must a visitor remember ten minutes after leaving?** This decides what
   the signature moment is spent on.
4. **What must NOT be on this site?** Anti-references are more useful than
   references. If they hate other agents' sites, we need to know which part —
   the stock photography, the headshot, the search widget, the tone.

Plus one practical: **what share of their traffic is mobile?** If it is over
half, the photography budget and the motion budget both change.

---

## 1. Listings — a spreadsheet

**Format:** one CSV or Google Sheet, one row per property, these exact columns.
They map 1:1 onto `src/data/properties.ts`, so a filled sheet drops straight in.

| Column | Type | Notes |
|---|---|---|
| `slug` | lowercase, hyphens | Becomes the URL and the image filenames. `thornfield-house` |
| `name` | text, **12–20 chars** | Shown at display size. Longer than ~24 wraps awkwardly on mobile |
| `town` | text | "Rhinebeck, NY" |
| `price` | integer, no formatting | `4850000` — the site formats it |
| `beds` / `baths` | integer | Halves as decimals: `2.5` |
| `sqft` / `acres` | number | Interior square feet; land in acres |
| `built` | text | "1897, renovated 2021" — prose is fine here |
| `card` | text, **100–120 chars** | The one line on listing cards. One concrete fact, not adjectives |
| `story_1`, `story_2` | text, **240–320 chars each** | Two paragraphs on the detail page. Exactly two |
| `particulars` | 6 label/value pairs | See below |
| `featured` | yes/no | Featured listings appear on the homepage. Pick 3 |

**Particulars** are the schedule of facts in the mono column — taxes, heat,
water, outbuildings, school district, commute. Supply **exactly six per listing**
(the design is built around six), labels **under 26 chars**, values **under 37**.
If a listing genuinely has nothing for a slot, tell us and we will pick a
different fact rather than print "N/A".

**On the copy itself:** specific beats impressive. "Chestnut floors that have
never been sanded thin" outperforms "exquisite period detailing" because a buyer
can picture it. If they'd rather we write it, send bullet-point facts per
property and we'll draft — but they must approve, because the voice is theirs.

---

## 2. Photography — the single biggest lever

This is what the site is made of, and it is the one thing we cannot produce.
Right now every image is placeholder art.

**Per listing, three images minimum:**

| Slot | Aspect | Use |
|---|---|---|
| `<slug>-1` | **3:2 landscape** | Exterior / the establishing shot. Also the hero, and the image that animates in the Viewing transition |
| `<slug>-2` | **4:5 portrait** | An interior detail |
| `<slug>-3` | **3:2 landscape** | The main living space, full-bleed |

**Plus three site-wide:** a landscape hero (`hero`, 3:2), a second landscape for
the About page (`valley`, 3:2), and an agent portrait (`maren`, **4:5**).

**Technical spec:**
- **3000px on the long edge minimum.** We downscale; we cannot upscale.
- **sRGB**, JPEG or TIFF, straight off the camera or the retoucher. Not
  screenshots, not Instagram exports, not anything already sharpened for web.
- **Named by slug** exactly as above. `thornfield-house-1.jpg`. This is the
  whole handover — filenames are the integration.
- **Shot at one time of day, graded consistently.** The design leans on a single
  dusk grade. A set mixing bright midday and blue-hour will look like a
  portfolio, not a brand.

**Licensing, in writing:** who shot them, and confirmation the client holds web
rights in perpetuity. Listing photos are frequently the photographer's
copyright, licensed only while the property is on the market — that is a real
liability once a house sells and the page becomes a "recently sold" reference.

**If they have no photography:** say so early. We shoot, or we commission, or we
change the design — a typographic direction with no photography can be
excellent, but it is a different design, decided up front, not a fallback we
discover in week three.

---

## 3. Brand

| Item | Format | Notes |
|---|---|---|
| Logo / wordmark | **SVG, text converted to outlines** | Plus a 512px transparent PNG for fallbacks. Not a JPEG off a business card |
| Colours | **Hex values**, named by role | If they only have "our green", send anything printed and we'll sample it |
| Typefaces | **Font files + the licence** | Web licensing is separate from desktop. If unlicensed, we substitute open-source and say so |
| Tone of voice | Any existing doc | Failing that, three adjectives that are not "modern", "clean", or "premium" |

If there is no brand at all, that is fine — but it becomes a branding job with
its own approval step, not something absorbed silently into the build.

---

## 4. Reviews and proof

**Format:** a short doc, one entry per review.

- **Quote, 100–175 characters.** The design sets these at display size; longer
  runs to four lines and loses its punch. The best ones name a specific thing
  the agent did, not how nice they were.
- **Attribution** — name or initials, and what the transaction was
  ("Sold in Kingston, 2026").
- **Written permission to publish**, per review. Screenshots of texts are not
  permission.

**Recently sold:** address, town, month closed, and the outcome line
("6% over ask, 8 days"). Confirm they are contractually free to publish each
result — some listing agreements restrict this.

---

## 5. Legal and compliance — currently all invented

Everything in the footer and on the contact page is placeholder and **must** be
replaced before launch.

- Licence number(s) and the exact licensee name, as the state requires it displayed
- Brokerage affiliation, and their logo/disclosure requirements — franchise
  brokerages usually mandate specific placement
- Office address, phone, email as they should publish them
- Fair-housing / equal-opportunity wording for their jurisdiction
- Privacy policy, and what happens to a contact-form submission — right now the
  form opens the visitor's email client and stores nothing, which is the
  privacy-cheapest option but may not match how they work

---

## 6. Operational

- **Domain**, and who controls the DNS
- **Where it deploys** — we assume Vercel; their IT may not
- **Who edits it after launch.** If the answer is "the agent, weekly", the
  listings need to move to a CMS. That is a scoped addition, not a tweak, and
  it is much cheaper decided now than retrofitted
- **Analytics**, and whether they need cookie consent as a result
- **Existing site** — is this a replacement? We need the URL list for redirects,
  or their search ranking goes with the old pages

---

## What we can start without

Real listings and real photography block a finished site, but not progress. With
section 0 answered and the brand in hand, we can build and get approval on the
design direction while photography is being shot — which is the long pole
almost every time.
