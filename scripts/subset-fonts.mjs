// Subset the shipped variable fonts to the characters this site actually sets.
// The upstream files carry every Latin subset and script the foundry ships;
// together they were 205KB and the largest item on the critical path.
//
// Run when the type stack changes:  node scripts/subset-fonts.mjs
// Requires: pip3 install fonttools brotli
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("src/fonts");
mkdirSync(OUT, { recursive: true });

// Latin basic + Latin-1 supplement (accented names, ©, °, ·, ×) + the
// typographic marks the copy uses: curly quotes, en/em dash, ellipsis, arrows.
const UNICODES = [
  "U+0020-007E",
  "U+00A0-00FF",
  "U+0131",
  "U+0152-0153",
  "U+2010-2015",
  "U+2018-201A",
  "U+201C-201E",
  "U+2020-2022",
  "U+2026",
  "U+2030",
  "U+2039-203A",
  "U+2044",
  "U+20AC",
  "U+2122",
  "U+2190-2193",
  "U+2212",
  "U+FEFF",
  "U+FFFD",
].join(",");

// fontTools keeps variable axes automatically. Geist keeps its weight axis
// (body copy uses 400 and 500). Fraunces is pinned: the display face is set at
// exactly one instance site-wide (opsz 144, wght 380), so its interpolation
// data is dead weight — pinning it is what takes it from 63KB to a usable size.
const jobs = [
  {
    src: "node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
    out: "geist-sans-latin.woff2",
  },
  {
    src: "node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
    out: "geist-mono-latin.woff2",
  },
  {
    src: "node_modules/@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2",
    out: "fraunces-opsz-latin.woff2",
    pin: ["opsz=144", "wght=380"],
  },
];

const TMP = path.resolve("node_modules/.cache/fontsubset");
mkdirSync(TMP, { recursive: true });

for (const job of jobs) {
  const dest = path.join(OUT, job.out);
  let input = job.src;

  if (job.pin) {
    input = path.join(TMP, `pinned-${job.out.replace(/\.woff2$/, ".ttf")}`);
    execFileSync("python3", [
      "-m",
      "fontTools.varLib.instancer",
      job.src,
      ...job.pin,
      `--output=${input}`,
    ]);
  }

  execFileSync("python3", [
    "-m",
    "fontTools.subset",
    input,
    `--unicodes=${UNICODES}`,
    "--layout-features=kern,liga,calt,ccmp,locl,mark,mkmk",
    "--flavor=woff2",
    "--no-hinting",
    `--output-file=${dest}`,
  ]);
  const before = statSync(job.src).size;
  const after = statSync(dest).size;
  console.log(
    `${job.out}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB ` +
      `(-${Math.round((1 - after / before) * 100)}%)`
  );
}
