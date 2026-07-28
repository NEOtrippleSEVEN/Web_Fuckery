// Art-directed placeholder photography.
// Every image slot gets a rasterized dusk-scape in the site palette so the
// static build reads as intentional. Real photography (generated or supplied)
// replaces these files 1:1 by name — nothing downstream changes.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "public/images");

const P = {
  evergreen: "#0c120f",
  cedar: "#161e19",
  parchment: "#f5f2e9",
  limestone: "#ede8dd",
  fog: "#8b958d",
  brass: "#b4915a",
};

// Deterministic PRNG per slot name so rebuilds are stable.
function rng(seedStr) {
  let h = 2166136261;
  for (const c of seedStr) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

function ridge(rand, w, h, base, amp) {
  const pts = [];
  const n = 8 + Math.floor(rand() * 4);
  for (let i = 0; i <= n; i++) {
    const x = (w / n) * i;
    const y = base + (rand() - 0.5) * amp;
    pts.push(`${x.toFixed(0)},${y.toFixed(0)}`);
  }
  return `M0,${h} L${pts.join(" L")} L${w},${h} Z`;
}

const grain = (id, opacity) => `
  <filter id="${id}">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope="${opacity}"/></feComponentTransfer>
    <feComposite operator="over" in2="SourceGraphic"/>
  </filter>`;

function duskScape(seed, w, h) {
  const rand = rng(seed);
  const sunX = w * (0.22 + rand() * 0.56);
  const horizon = 0.5 + rand() * 0.1;
  const sunY = h * (horizon - 0.06 - rand() * 0.06);
  const sunR = Math.min(w, h) * (0.07 + rand() * 0.06);
  const warm = rand() > 0.5; // half the set leans amber, half stays green
  const skyTop = warm ? "#2c3527" : "#243027";
  const band = warm ? "#54442c" : "#3d3b28";
  const r1 = ridge(rand, w, h, h * (horizon + 0.02), h * 0.1);
  const r2 = ridge(rand, w, h, h * (horizon + 0.14), h * 0.12);
  const r3 = ridge(rand, w, h, h * (horizon + 0.28), h * 0.1);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${skyTop}"/>
      <stop offset="${(horizon - 0.18).toFixed(2)}" stop-color="#1c2620"/>
      <stop offset="${(horizon - 0.02).toFixed(2)}" stop-color="${band}"/>
      <stop offset="${(horizon + 0.1).toFixed(2)}" stop-color="#131c16"/>
      <stop offset="1" stop-color="#0a100c"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#e8c07c" stop-opacity="0.85"/>
      <stop offset="0.4" stop-color="${P.brass}" stop-opacity="0.4"/>
      <stop offset="1" stop-color="${P.brass}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <circle cx="${sunX}" cy="${sunY}" r="${sunR * 3.4}" fill="url(#glow)"/>
  <circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="#e3bd7e" opacity="0.9"/>
  <path d="${r1}" fill="#1a251d"/>
  <path d="${r2}" fill="#131c16"/>
  <path d="${r3}" fill="#0d1410"/>
</svg>`;
}

function interior(seed, w, h) {
  const rand = rng(seed);
  const floorY = h * 0.74;
  const panels = [];
  const glows = [];
  const n = 2 + Math.floor(rand() * 2);
  for (let i = 0; i < n; i++) {
    const pw = w * (0.1 + rand() * 0.09);
    const px = w * (0.1 + (0.8 / n) * i + rand() * 0.06);
    const py = h * (0.1 + rand() * 0.06);
    const ph = floorY - py;
    const cx = px + pw / 2;
    glows.push(
      `<ellipse cx="${cx.toFixed(0)}" cy="${(py + ph * 0.45).toFixed(0)}" rx="${(pw * 1.6).toFixed(0)}" ry="${(ph * 0.75).toFixed(0)}" fill="url(#halo)"/>`
    );
    panels.push(
      `<rect x="${px.toFixed(0)}" y="${py.toFixed(0)}" width="${pw.toFixed(0)}" height="${ph.toFixed(0)}" rx="${(pw / 2).toFixed(0)}" fill="url(#pane)"/>`,
      `<rect x="${(cx - pw * 0.42).toFixed(0)}" y="${(floorY + 8).toFixed(0)}" width="${(pw * 0.84).toFixed(0)}" height="${(h - floorY - 16).toFixed(0)}" fill="#c8b58a" opacity="0.05"/>`
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="room" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#28322a"/>
      <stop offset="0.55" stop-color="#18211a"/>
      <stop offset="0.74" stop-color="#111813"/>
      <stop offset="0.76" stop-color="#1c2119"/>
      <stop offset="1" stop-color="#10140f"/>
    </linearGradient>
    <linearGradient id="pane" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e9d9b4" stop-opacity="0.34"/>
      <stop offset="0.6" stop-color="#d8c194" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#c8b58a" stop-opacity="0.08"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#d8c194" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#d8c194" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#room)"/>
  ${glows.join("\n  ")}
  ${panels.join("\n  ")}
</svg>`;
}

function portrait(seed, w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="p" cx="0.5" cy="0.38" r="0.85">
      <stop offset="0" stop-color="#3a453a"/>
      <stop offset="0.55" stop-color="#1e2820"/>
      <stop offset="1" stop-color="#0e130f"/>
    </radialGradient>
    <radialGradient id="pl" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#e8c07c" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#e8c07c" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#p)"/>
  <ellipse cx="${w * 0.5}" cy="${h * 0.36}" rx="${w * 0.42}" ry="${h * 0.3}" fill="url(#pl)"/>
  <circle cx="${w / 2}" cy="${h * 0.4}" r="${w * 0.27}" fill="none" stroke="${P.brass}" stroke-opacity="0.45" stroke-width="2.5"/>
  <circle cx="${w / 2}" cy="${h * 0.4}" r="${w * 0.19}" fill="${P.brass}" opacity="0.1"/>
</svg>`;
}

const slots = [
  { name: "hero", w: 2560, h: 1600, kind: duskScape },
  { name: "valley", w: 2240, h: 1400, kind: duskScape },
  { name: "maren", w: 1440, h: 1800, kind: portrait },
];

const props = [
  "thornfield-house",
  "the-glasswing",
  "beacon-hollow",
  "larch-and-stone",
  "quarry-edge-house",
  "the-meridian",
];
for (const slug of props) {
  slots.push({ name: `${slug}-1`, w: 1920, h: 1280, kind: duskScape });
  slots.push({ name: `${slug}-2`, w: 1600, h: 2000, kind: interior });
  slots.push({ name: `${slug}-3`, w: 1920, h: 1280, kind: interior });
}

await mkdir(OUT, { recursive: true });
for (const s of slots) {
  const svg = s.kind(s.name, s.w, s.h);
  const file = path.join(OUT, `${s.name}.webp`);
  await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(file);
  console.log("wrote", path.relative(process.cwd(), file));
}
