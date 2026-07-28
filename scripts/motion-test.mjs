// Visual + behavioral checks for the motion layer.
import { chromium } from "playwright-core";

const OUT = "/tmp/claude-0/-home-user-Web-Fuckery/3a1bccc4-c1c0-5005-a1e0-a41e9fcf23bf/scratchpad";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

// 1. Normal motion: land on home, capture hero after intro, then mid-scroll reveal state.
const page = await browser.newPage({ viewport: { width: 1512, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}/m-hero-after-intro.png` });

await page.mouse.wheel(0, 1400);
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/m-mid-reveal.png` });
await page.mouse.wheel(0, 1200);
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/m-settled.png` });

// data-reveal elements that entered viewport should be visible (opacity ~1)
const revealState = await page.evaluate(() => {
  const els = [...document.querySelectorAll("[data-reveal]")];
  return els.slice(0, 6).map((el) => ({
    top: Math.round(el.getBoundingClientRect().top),
    opacity: getComputedStyle(el).opacity,
  }));
});
console.log("reveal state:", JSON.stringify(revealState));
console.log("page errors:", errors.length ? errors : "none");
await page.close();

// 2. Reduced motion: everything must be visible with no Lenis and no hidden elements.
const rm = await browser.newPage({ viewport: { width: 1512, height: 900 } });
await rm.emulateMedia({ reducedMotion: "reduce" });
await rm.goto("http://localhost:3100/", { waitUntil: "networkidle" });
await rm.waitForTimeout(600);
const rmState = await rm.evaluate(() => {
  const els = [...document.querySelectorAll("[data-reveal]")];
  const hidden = els.filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length;
  return { total: els.length, hidden, lenis: document.documentElement.classList.contains("lenis") };
});
console.log("reduced motion:", JSON.stringify(rmState));
await rm.screenshot({ path: `${OUT}/m-reduced.png` });
await rm.close();

await browser.close();
