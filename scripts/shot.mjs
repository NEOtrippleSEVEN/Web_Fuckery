import { chromium } from "playwright-core";
import path from "node:path";

const OUT = "/tmp/claude-0/-home-user-Web-Fuckery/3a1bccc4-c1c0-5005-a1e0-a41e9fcf23bf/scratchpad";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

const targets = [
  { name: "home-desktop", url: "/", w: 1512, h: 900, full: true },
  { name: "property-desktop", url: "/properties/thornfield-house", w: 1512, h: 900, full: true },
  { name: "properties-desktop", url: "/properties", w: 1512, h: 900, full: true },
  { name: "about-desktop", url: "/about", w: 1512, h: 900, full: true },
  { name: "contact-desktop", url: "/contact", w: 1512, h: 900, full: true },
  { name: "notfound-desktop", url: "/definitely-not-a-page", w: 1512, h: 900, full: false },
  { name: "home-mobile", url: "/", w: 390, h: 844, full: true },
  { name: "property-mobile", url: "/properties/thornfield-house", w: 390, h: 844, full: true },
  { name: "home-320", url: "/", w: 320, h: 700, full: true },
];

for (const t of targets) {
  const page = await browser.newPage({ viewport: { width: t.w, height: t.h } });
  await page.goto(`http://localhost:3100${t.url}`, { waitUntil: "networkidle" });
  // Walk the page so lazy images load before a fullPage capture
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, `${t.name}.png`), fullPage: t.full });
  await page.close();
  console.log("shot", t.name);
}

await browser.close();
