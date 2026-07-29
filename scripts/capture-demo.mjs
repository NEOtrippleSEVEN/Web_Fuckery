// Records a walkthrough video of the real site: preloader, hero choreography,
// scroll reveals, and the Viewing transition into a property page.
import { chromium } from "playwright-core";
import { rename, readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = "http://localhost:3100";
const OUT = process.argv[2] || "/tmp/demo";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 810 },
  recordVideo: { dir: OUT, size: { width: 1440, height: 810 } },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();

// Smooth, human-paced scrolling — the real Lenis easing does the rest.
const glide = async (distance, steps = 26, pause = 34) => {
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, distance / steps);
    await page.waitForTimeout(pause);
  }
};

// Lenis keeps animating after the wheel stops; clicking before it settles
// reads a stale bounding box and the click lands on nothing.
const settle = async () => {
  await page.waitForFunction(
    () =>
      new Promise((resolve) => {
        const start = window.scrollY;
        setTimeout(() => resolve(Math.abs(window.scrollY - start) < 1), 180);
      }),
    { timeout: 5000 }
  );
};

// 1. Arrive cold: preloader plays, then the hero lifts in.
await page.goto(BASE + "/", { waitUntil: "commit" });
await page.waitForTimeout(4200);

// 2. Leave the hero — content lifts away faster than the photograph.
await glide(900);
await page.waitForTimeout(500);

// 3. Through the light section, watching the reveals fire.
await glide(1000);
await page.waitForTimeout(800);

// 4. The Viewing. Let the browser frame the card (it handles direction), let
//    Lenis settle, then read the box — a stale box means clicking dead space.
const card = page.locator("a[data-viewing]").first();
await card.scrollIntoViewIfNeeded();
await page.waitForTimeout(1400); // Lenis keeps easing after the native jump
await settle();

// Nudge until the card is comfortably framed, in whichever direction is needed.
const TARGET_Y = 120;
for (let i = 0; i < 12; i++) {
  const b = await card.boundingBox();
  if (!b) break;
  const delta = b.y - TARGET_Y;
  if (Math.abs(delta) < 40) break;
  await glide(delta, 6, 30);
  await page.waitForTimeout(260);
}
await settle();
await page.waitForTimeout(900);

const box = await card.boundingBox();
if (!box || box.y < -20 || box.y > 700) {
  throw new Error(`listing card not in frame (${JSON.stringify(box)})`);
}
const cx = box.x + box.width / 2;
const cy = box.y + box.height / 2;
await page.mouse.move(cx, cy, { steps: 20 });
await page.waitForTimeout(800);
await page.mouse.click(cx, cy);

await page.waitForURL(/\/properties\/[a-z-]+$/, { timeout: 8000 });
await page.waitForTimeout(2400);

// 5. Read down the property dossier.
await glide(1100);
await page.waitForTimeout(600);
await glide(1400);
await page.waitForTimeout(900);

await ctx.close();
await browser.close();

const files = (await readdir(OUT)).filter((f) => f.endsWith(".webm"));
if (files[0]) {
  await rename(path.join(OUT, files[0]), path.join(OUT, "walkthrough.webm"));
  console.log("video:", path.join(OUT, "walkthrough.webm"));
}
