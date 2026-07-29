// Assembles the self-contained build-review page from review-template.html:
// every asset becomes a data URI, because the Artifact CSP blocks every
// external host.
//
// The asset dir is whatever scratchpad you pointed shot.mjs and capture-demo.mjs
// at; it needs the optimised plates (opt-*.webp), the poster, and
// demo/walk-web.webm. See the header of review-template.html for the full list.
import { readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const S = process.argv[2];
const OUT = process.argv[3];
if (!S || !OUT) {
  console.error("usage: node scripts/build-review.mjs <asset-dir> <out.html>");
  process.exit(1);
}

const uri = async (file, mime) => {
  const buf = await readFile(file);
  return `data:${mime};base64,${buf.toString("base64")}`;
};

const subs = {
  __FONT_SANS__: await uri("src/fonts/geist-sans-latin.woff2", "font/woff2"),
  __FONT_MONO__: await uri("src/fonts/geist-mono-latin.woff2", "font/woff2"),
  __VIDEO__: await uri(path.join(S, "demo/walk-web.webm"), "video/webm"),
  __POSTER__: await uri(path.join(S, "opt-poster.webp"), "image/webp"),
  __IMG_FLIGHT__: await uri(path.join(S, "opt-t17.2.webp"), "image/webp"),
  __IMG_LANDED__: await uri(path.join(S, "opt-t19.5.webp"), "image/webp"),
  __IMG_HOME__: await uri(path.join(S, "opt-home-desktop.webp"), "image/webp"),
  __IMG_PROPERTY__: await uri(path.join(S, "opt-property-desktop.webp"), "image/webp"),
  __IMG_PROPERTIES__: await uri(path.join(S, "opt-properties-desktop.webp"), "image/webp"),
  __IMG_ABOUT__: await uri(path.join(S, "opt-about-desktop.webp"), "image/webp"),
  __IMG_CONTACT__: await uri(path.join(S, "opt-contact-desktop.webp"), "image/webp"),
  __IMG_404__: await uri(path.join(S, "opt-notfound-desktop.webp"), "image/webp"),
  __IMG_HOME_M__: await uri(path.join(S, "opt-home-mobile.webp"), "image/webp"),
  __IMG_PROPERTY_M__: await uri(path.join(S, "opt-property-mobile.webp"), "image/webp"),
};

// Template lives beside this script, not in the asset dir — the asset dir is
// disposable scratch, the template is source.
let html = await readFile(new URL("./review-template.html", import.meta.url), "utf8");
for (const [token, value] of Object.entries(subs)) {
  if (!html.includes(token)) throw new Error(`template is missing ${token}`);
  html = html.replaceAll(token, value);
}

const leftover = html.match(/__[A-Z_]+__/g);
if (leftover) throw new Error(`unsubstituted tokens: ${[...new Set(leftover)].join(", ")}`);

await writeFile(OUT, html);
const { size } = await stat(OUT);
console.log(`wrote ${OUT} — ${(size / 1024 / 1024).toFixed(2)}MB`);
