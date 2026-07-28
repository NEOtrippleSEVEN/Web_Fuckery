// Preloader + Viewing transition checks.
import { chromium } from "playwright-core";

const OUT = "/tmp/claude-0/-home-user-Web-Fuckery/3a1bccc4-c1c0-5005-a1e0-a41e9fcf23bf/scratchpad";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1512, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

// 1. First visit: preloader shows, then releases.
await page.goto("http://localhost:3100/", { waitUntil: "commit" });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/s-preloader.png` });
await page.waitForTimeout(2800);
const overlayGone = await page.evaluate(() => !document.querySelector("[data-loader-overlay]"));
await page.screenshot({ path: `${OUT}/s-after-loader.png` });
console.log("preloader dismissed:", overlayGone);

// 2. The Viewing: click the first property card.
await page.mouse.wheel(0, 1900);
await page.waitForTimeout(1400);
await page.click("a[data-viewing]");
await page.waitForTimeout(480);
await page.screenshot({ path: `${OUT}/s-viewing-mid.png` });
await page.waitForTimeout(2200);
const state = await page.evaluate(() => ({
  path: location.pathname,
  overlay: !!document.querySelector("[data-viewing-overlay]"),
  scrollY: window.scrollY,
}));
await page.screenshot({ path: `${OUT}/s-viewing-landed.png` });
console.log("after viewing:", JSON.stringify(state));

// 3. Return visit: no preloader.
await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });
const loaderOnReturn = await page.evaluate(() => !!document.querySelector("[data-loader-overlay]"));
console.log("loader on return visit:", loaderOnReturn);
console.log("page errors:", errors.length ? errors : "none");

await browser.close();
