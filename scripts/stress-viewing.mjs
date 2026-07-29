// Adversarial tests for the Viewing. It stops Lenis and puts an opaque
// full-screen overlay up, so any path that fails to settle leaves the page
// looking frozen. Each case asserts the page is usable again afterwards.
import { chromium } from "playwright-core";

const BASE = "http://localhost:3100";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const results = [];

const fresh = async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("    pageerror:", String(e).slice(0, 120)));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page
    .waitForFunction(() => !document.querySelector("[data-loader-overlay]"), { timeout: 9000 })
    .catch(() => {});
  await page.waitForTimeout(400);
  return { ctx, page };
};

const frameCard = async (page) => {
  const card = page.locator("a[data-viewing]").first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const box = await card.boundingBox();
  if (!box) throw new Error("no card");
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

// Is the page actually usable: no overlay stuck, and scrolling still works?
const health = async (page) => {
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(900);
  return await page.evaluate((b) => ({
    overlay: !!document.querySelector("[data-viewing-overlay]"),
    scrolled: Math.abs(window.scrollY - b) > 50,
    path: location.pathname,
  }), before);
};

const record = (name, ok, detail) => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "  ok  " : " FAIL "} ${name} — ${JSON.stringify(detail)}`);
};

// 1. Baseline: a single click must land and release.
{
  const { ctx, page } = await fresh();
  const p = await frameCard(page);
  await page.mouse.click(p.x, p.y);
  await page.waitForTimeout(3500);
  const h = await health(page);
  record("single click settles", !h.overlay && h.scrolled && h.path.startsWith("/properties/"), h);
  await ctx.close();
}

// 2. Double-click: the second click is ignored by the guard, so it must not
//    reach the router and strand the overlay.
{
  const { ctx, page } = await fresh();
  const p = await frameCard(page);
  await page.mouse.click(p.x, p.y);
  await page.waitForTimeout(90);
  await page.mouse.click(p.x, p.y);
  await page.waitForTimeout(4500);
  const h = await health(page);
  record("double click settles", !h.overlay && h.scrolled, h);
  await ctx.close();
}

// 3. Navigating away mid-flight must not leave the overlay up.
{
  const { ctx, page } = await fresh();
  const p = await frameCard(page);
  await page.mouse.click(p.x, p.y);
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    const about = [...document.querySelectorAll("a")].find((a) => a.getAttribute("href") === "/about");
    about?.click();
  });
  await page.waitForTimeout(4500);
  const h = await health(page);
  record("nav away mid-flight settles", !h.overlay && h.scrolled, h);
  await ctx.close();
}

// 4. Back button straight after landing.
{
  const { ctx, page } = await fresh();
  const p = await frameCard(page);
  await page.mouse.click(p.x, p.y);
  await page.waitForTimeout(3200);
  await page.goBack();
  await page.waitForTimeout(2500);
  const h = await health(page);
  record("back after viewing settles", !h.overlay && h.scrolled, h);
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(failed.length ? `\n${failed.length} FAILING` : "\nAll Viewing stress cases passed.");
process.exit(failed.length ? 1 : 0);
