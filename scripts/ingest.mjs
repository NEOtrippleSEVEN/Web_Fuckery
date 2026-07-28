// Ingest a generated image into an image slot:
//   node scripts/ingest.mjs <url> <slot> <width> <height>
// Fetches, cover-crops to the slot's aspect, converts to webp, writes
// public/images/<slot>.webp (same name the manifest imports).
import sharp from "sharp";
import path from "node:path";

const [url, slot, w, h] = process.argv.slice(2);
if (!url || !slot || !w || !h) {
  console.error("usage: node scripts/ingest.mjs <url> <slot> <width> <height>");
  process.exit(1);
}

// Accepts a local file path (downloaded via curl, which honors the proxy) or a URL.
let buf;
if (url.startsWith("http")) {
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`fetch failed: ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  buf = Buffer.from(await res.arrayBuffer());
} else {
  buf = url; // sharp reads the path directly
}

const out = path.resolve("public/images", `${slot}.webp`);
await sharp(buf)
  .resize(Number(w), Number(h), { fit: "cover", withoutEnlargement: false })
  .webp({ quality: 80 })
  .toFile(out);

const meta = await sharp(out).metadata();
console.log(`wrote ${out} ${meta.width}x${meta.height}`);
