// Prebuild: upgrade the committed placeholder art to accepted photography.
//
// Photography cannot be produced during a build (see docs/DIRECTION.md and the
// spec's asset table), so the repo commits art-directed placeholders that look
// intentional, and this step swaps in real images where they are reachable.
// Any failure — no egress, expired URL, bad payload — leaves the committed
// placeholder in place and the build continues. That is deliberate: a missing
// photograph must never fail a deploy.
//
// Each slot is encoded down until it fits MAX_BYTES so no single image can
// blow the performance budget.
import sharp from "sharp";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const MAX_BYTES = 120 * 1024;
const QUALITY_STEPS = [72, 64, 56, 48];

const manifest = JSON.parse(
  await readFile(new URL("./photography.json", import.meta.url), "utf8")
);

let fetched = 0;
let kept = 0;

for (const [slot, spec] of Object.entries(manifest.slots)) {
  const out = path.resolve("public/images", `${slot}.webp`);
  try {
    const res = await fetch(spec.url, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());

    let written = 0;
    for (const quality of QUALITY_STEPS) {
      await sharp(buf)
        .resize(spec.width, spec.height, { fit: "cover" })
        .webp({ quality })
        .toFile(out);
      written = (await stat(out)).size;
      if (written <= MAX_BYTES) break;
    }

    fetched++;
    console.log(`photography: ${slot} ✓ ${(written / 1024).toFixed(0)}KB`);
  } catch (err) {
    kept++;
    console.warn(`photography: ${slot} — kept placeholder (${err.message})`);
  }
}

console.log(
  `photography: ${fetched} fetched, ${kept} on placeholder art` +
    (kept ? " — see scripts/photography.json" : "")
);
