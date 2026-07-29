// QA gate — the mechanical half of the §07 checklist.
import { chromium } from "playwright-core";

const BASE = "http://localhost:3100";
const OUT = "/tmp/claude-0/-home-user-Web-Fuckery/3a1bccc4-c1c0-5005-a1e0-a41e9fcf23bf/scratchpad";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const routes = ["/", "/properties", "/properties/the-glasswing", "/about", "/contact", "/nope"];
const fails = [];
const note = (ok, label) => {
  console.log(`${ok ? "  ok  " : " FAIL "} ${label}`);
  if (!ok) fails.push(label);
};

// 1. No horizontal scroll at 320px, on every route.
const narrow = await browser.newPage({ viewport: { width: 320, height: 700 } });
for (const route of routes) {
  await narrow.goto(BASE + route, { waitUntil: "networkidle" });
  await narrow
    .waitForFunction(() => !document.querySelector("[data-loader-overlay]"), { timeout: 6000 })
    .catch(() => {});
  const overflow = await narrow.evaluate(() => {
    const d = document.documentElement;
    const widest = [...document.querySelectorAll("body *")]
      .filter((el) => el.getBoundingClientRect().right > d.clientWidth + 1)
      .map((el) => el.tagName + "." + String(el.className).slice(0, 40))[0];
    return { scrollW: d.scrollWidth, clientW: d.clientWidth, widest };
  });
  note(
    overflow.scrollW <= overflow.clientW + 1,
    `320px no h-scroll ${route} (${overflow.scrollW}/${overflow.clientW}${overflow.widest ? " ← " + overflow.widest : ""})`
  );
}
await narrow.close();

// 2. Heading hierarchy, alt text, and a single h1 per route.
const page = await browser.newPage({ viewport: { width: 1512, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
for (const route of routes) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page
    .waitForFunction(() => !document.querySelector("[data-loader-overlay]"), { timeout: 6000 })
    .catch(() => {});
  const a11y = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img")];
    const levels = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) => +h.tagName[1]);
    let skipped = null;
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) skipped = `h${levels[i - 1]}→h${levels[i]}`;
    }
    return {
      h1s: document.querySelectorAll("h1").length,
      noAlt: imgs.filter((i) => !i.hasAttribute("alt")).length,
      skipped,
    };
  });
  note(a11y.h1s === 1, `single h1 ${route} (found ${a11y.h1s})`);
  note(a11y.noAlt === 0, `all images have alt ${route} (${a11y.noAlt} missing)`);
  note(!a11y.skipped, `heading order ${route}${a11y.skipped ? " " + a11y.skipped : ""}`);
}

// 3. Keyboard: focus must be visible and reach the nav.
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page
  .waitForFunction(() => !document.querySelector("[data-loader-overlay]"), { timeout: 6000 })
  .catch(() => {});
const focus = [];
for (let i = 0; i < 5; i++) {
  await page.keyboard.press("Tab");
  focus.push(
    await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        tag: el.tagName,
        text: (el.textContent || "").trim().slice(0, 28),
        outline: s.outlineWidth,
      };
    })
  );
}
note(
  focus.every((f) => f && f.outline !== "0px"),
  `focus ring visible on first 5 tab stops`
);
console.log("    tab order:", focus.map((f) => `${f.tag}:${f.text}`).join(" → "));
await page.screenshot({ path: `${OUT}/qa-focus.png` });

note(errors.length === 0, `no console errors (${errors.length})`);
await browser.close();

console.log(fails.length ? `\n${fails.length} FAILING:\n- ` + fails.join("\n- ") : "\nAll QA checks passed.");
