// Checks glass: text contrast on glass, and that Glass visibly differs from Normal. Contrast first: where the background is a photo seen through blur and changes under every
// letter. For each component page in Glass mode (light and dark): find the text on glass, hide all text, capture
// what is really behind it, and compare the text colour with the worst pixel under its box.
// 4.5:1 for body text, 3:1 for large text (24px, or 18.66px bold). Needs the docs on :3100.
//
//   node scripts/glass-contrast.mjs [base-url]
import { chromium } from "playwright";
import { PNG } from "pngjs";

const base = process.argv[2] ?? "http://localhost:3100";
// GLASS_ONLY=contrast|difference|solid runs one check, for machines short on memory.
const only = process.env.GLASS_ONLY;
const run = (phase) => !only || only === phase;
// Static previews, and overlays opened by the first button in the preview.
const PAGES = ["card", "input", "textarea", "input-group", "tabs", "badge", "button", "menubar", "liquid-glass", "tab-bar"];
const OVERLAYS = ["dialog", "alert-dialog", "popover", "dropdown-menu", "sheet"];
const GLASS = '[data-slot=card],[data-slot=sidebar-inner],[data-slot=menubar],[data-slot=navigation-menu-list],[data-slot$=-content],[data-slot=command],[data-slot=input],[data-slot=textarea],[data-slot=input-group],[data-slot=select-trigger],[data-slot=tabs-list],[data-slot=button][data-variant=outline],[data-slot=button][data-variant=secondary],[data-slot=badge],[data-slot=liquid-glass]';

const lum = ([r, g, b]) => {
  const c = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
};
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** Glass needs its photo: wait until it has arrived (a slow network otherwise measures glass over black). */
const waitForPhoto = (page) =>
  page
    .waitForFunction(() => performance.getEntriesByType("resource").some((e) => e.name.includes("unsplash") && e.responseEnd > 0), null, { timeout: 60000 })
    .catch(() => console.log("  photo did not load; results for this page are not meaningful"));

const browser = await chromium.launch();
const failures = [];
let checked = 0;
for (const scheme of run("contrast") ? ["light", "dark"] : []) {
  for (const name of [...PAGES, ...OVERLAYS]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
    await page.goto(`${base}/docs/components/${name}`, { waitUntil: "domcontentloaded" });
    await page.evaluate((s) => {
      localStorage.setItem("beam-surface", "glass");
      localStorage.setItem("theme", s);
    }, scheme);
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForPhoto(page);
    const stage = page.locator(".not-prose [data-theme=default]").first();
    await stage.scrollIntoViewIfNeeded();
    if (OVERLAYS.includes(name)) {
      await stage.locator("button").first().click();
      await page.waitForTimeout(600);
    }
    await page.waitForTimeout(2500);
    const texts = await page.evaluate((GLASS) => {
      const out = [];
      // Any CSS colour (oklab, color-mix...) to sRGB, by painting one pixel.
      const ctx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true });
      const toRgb = (c) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = c;
        ctx.fillRect(0, 0, 1, 1);
        return [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)];
      };
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const el = n.parentElement;
        if (!el || !n.textContent.trim() || el.closest("[aria-hidden=true]")) continue;
        // Only text whose nearest painted background is glass: text on a solid button is not on glass.
        let bg = el;
        while (bg && bg !== document.body) {
          const cs = getComputedStyle(bg);
          if (bg.matches(GLASS) || cs.backgroundColor !== "rgba(0, 0, 0, 0)" || cs.backgroundImage !== "none" || cs.backdropFilter !== "none") break;
          bg = bg.parentElement;
        }
        if (!bg || bg === document.body || !bg.matches(GLASS)) continue;
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        if (!r.width || !r.height || s.visibility === "hidden" || Number(s.opacity) === 0 || r.bottom < 0 || r.top > innerHeight) continue;
        const rgb = toRgb(s.color);
        out.push({ text: n.textContent.trim().slice(0, 30), x: r.x, y: r.y, w: r.width, h: r.height, rgb, size: parseFloat(s.fontSize), weight: Number(s.fontWeight) });
      }
      return out;
    }, GLASS);
    await page.addStyleTag({ content: "*{color:transparent!important;text-shadow:none!important;caret-color:transparent!important}" });
    await page.waitForTimeout(150);
    const png = PNG.sync.read(await page.screenshot());
    for (const t of texts) {
      const fg = lum(t.rgb);
      let worst = Number.POSITIVE_INFINITY;
      // The middle band of the box, clear of rounded corners (which show the photo outside the shape); the
      // glyphs sit there.
      const insetX = Math.min(t.h / 2, t.w / 4);
      for (let y = Math.max(0, Math.floor(t.y + t.h * 0.25)); y < Math.min(png.height, Math.ceil(t.y + t.h * 0.75)); y++)
        for (let x = Math.max(0, Math.floor(t.x + insetX)); x < Math.min(png.width, Math.ceil(t.x + t.w - insetX)); x++) {
          const i = (y * png.width + x) * 4;
          worst = Math.min(worst, ratio(fg, lum([png.data[i], png.data[i + 1], png.data[i + 2]])));
        }
      if (!Number.isFinite(worst)) continue;
      checked++;
      const large = t.size >= 24 || (t.size >= 18.66 && t.weight >= 700);
      const need = large ? 3 : 4.5;
      if (worst < need) failures.push(`${scheme} ${name}: "${t.text}" ${worst.toFixed(2)}:1 (needs ${need})`);
    }
    await page.close();
  }
}
// Glass must look like glass: the component in Glass differs clearly from Normal (mean CIELAB ΔE above 10).
const lab = ([r, g, b]) => {
  const f = (v) => ((v /= 255) > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92);
  const [R, G, B] = [f(r), f(g), f(b)];
  const k = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const [x, y, z] = [k((0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047), k(0.2126 * R + 0.7152 * G + 0.0722 * B), k((0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883)];
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
};
const DIFFER = [["card", "[data-slot=card]"], ["button", "[data-slot=button]"], ["input", "[data-slot=input]"], ["tabs", "[data-slot=tabs-list]"]];
const same = [];
for (const scheme of run("difference") ? ["light", "dark"] : []) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
  const page = await context.newPage();
  for (const [name, selector] of DIFFER) {
    const shots = {};
    for (const surface of ["normal", "glass"]) {
      await page.goto(`${base}/docs/components/${name}`, { waitUntil: "domcontentloaded" });
      await page.evaluate(([s, m]) => {
        localStorage.setItem("beam-surface", s);
        localStorage.setItem("theme", m);
      }, [surface, scheme]);
      await page.reload({ waitUntil: "domcontentloaded" });
      if (surface === "glass") await waitForPhoto(page);
      const stage = page.locator(".not-prose [data-theme=default]").first();
      await stage.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      shots[surface] = PNG.sync.read(await stage.locator(selector).first().screenshot());
    }
    const [a, c] = [shots.normal, shots.glass];
    let sum = 0;
    let n = 0;
    for (let y = 0; y < Math.min(a.height, c.height); y++)
      for (let x = 0; x < Math.min(a.width, c.width); x++) {
        const i = (y * a.width + x) * 4;
        const j = (y * c.width + x) * 4;
        const p = lab([a.data[i], a.data[i + 1], a.data[i + 2]]);
        const q = lab([c.data[j], c.data[j + 1], c.data[j + 2]]);
        sum += Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
        n++;
      }
    const delta = sum / n;
    if (delta <= 10) same.push(`${scheme} ${name}: glass looks like normal (ΔE ${delta.toFixed(1)})`);
  }
  await context.close();
}

// No solid parts left: in Glass, nothing inside a preview may keep an opaque fill, apart from the fills iOS keeps
// solid (a switch that is on, a checked box, thumbs, progress, images).
const SOLID_OK = '[data-slot="switch"][data-state="checked"],[data-slot="switch-thumb"],[data-slot="checkbox"][data-state="checked"],[data-slot="radio-group-indicator"],[data-slot="progress-indicator"],[role="slider"],[data-slot="slider"] *,img,svg,video,canvas,code,pre,[data-slot="tab-bar"] *,[data-slot="liquid-glass"] *,[data-slot="chart"] *';
const { readFileSync } = await import("node:fs");
const all = JSON.parse(readFileSync(new URL("../apps/docs-site/content/docs/components/meta.json", import.meta.url), "utf8")).pages.filter((n) => !n.startsWith("---") && n !== "index" && n !== "sidebars" && n !== "glass");
const solid = [];
if (run("solid")) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(() => {
    try {
      localStorage.setItem("beam-surface", "glass");
    } catch {}
  });
  await context.route(/images\.unsplash\.com/, (r) => r.abort());
  const page = await context.newPage();
  for (const name of all) {
    await page.goto(`${base}/docs/components/${name}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(900);
    const found = await page.evaluate((OK) => {
      const stage = document.querySelector(".not-prose [data-preview]");
      if (!stage) return [];
      const out = [];
      for (const el of stage.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (r.width < 12 || r.height < 12 || el.closest(OK) || el.matches(OK)) continue;
        const bg = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0];
        const alpha = bg.length > 3 ? bg[3] : 1;
        if (alpha >= 0.95) out.push(`${el.dataset.slot ?? el.tagName.toLowerCase()} rgb(${bg.slice(0, 3).join(" ")})`);
      }
      return [...new Set(out)].slice(0, 4);
    }, SOLID_OK);
    if (found.length) solid.push(`${name}: ${found.join(", ")}`);
  }
  await context.close();
}

await browser.close();
console.log(`glass solid parts: ${all.length} component pages, ${solid.length} with opaque parts`);
for (const s of solid) console.log(`  ${s}`);
console.log(`glass contrast: ${checked} text boxes checked, ${failures.length} below the minimum`);
for (const f of failures) console.log(`  ${f}`);
console.log(`glass difference: ${DIFFER.length * 2} components compared, ${same.length} too close to normal`);
for (const s of same) console.log(`  ${s}`);
process.exit(failures.length || same.length || solid.length ? 1 : 0);
