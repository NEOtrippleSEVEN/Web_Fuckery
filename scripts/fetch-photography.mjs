// Prebuild: swap art-directed placeholders for accepted photography.
// Runs before `next build`. Any failure (offline CI, expired CDN URL) leaves
// the committed placeholder in place and the build continues — by design.
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";

const manifest = JSON.parse(
  await readFile(new URL("./photography.json", import.meta.url), "utf8")
);

let ok = 0;
let skipped = 0;
for (const [slot, spec] of Object.entries(manifest.slots)) {
  const out = path.resolve("public/images", `${slot}.webp`);
  try {
    const res = await fetch(spec.url, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .resize(spec.width, spec.height, { fit: "cover" })
      .webp({ quality: 78 })
      .toFile(out);
    ok++;
    console.log(`photography: ${slot} ✓`);
  } catch (err) {
    skipped++;
    console.warn(`photography: ${slot} kept placeholder (${err.message})`);
  }
}
console.log(`photography: ${ok} fetched, ${skipped} placeholder`);
