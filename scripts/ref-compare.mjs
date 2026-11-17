// Checks a rebuild against its captured reference (docs/beam-ui/00-rules.md, step 4).
//
//   node scripts/ref-compare.mjs <reference-dir> <name> <rebuild-url> [--selector "[data-ref-root] > *"]
//
// 1. Layout: every text element in the reference is matched by its text in the rebuild; its box must sit within
//    2px (x, y, width, height), and its font size, weight, line height and letter spacing must be equal.
// 2. Pixels: the rebuild is screenshot at the reference's size; a side-by-side and a diff image are written next
//    to the reference so a person can see both. Colours differ on purpose (palette tokens), so pixels are shown,
//    not scored; the layout check is the gate.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const [dir, name, url, ...rest] = process.argv.slice(2);
const selector = rest.includes("--selector") ? rest[rest.indexOf("--selector") + 1] : "[data-ref-root] > *";
const TOLERANCE = 2;
/** Font substitution allowance: text width may differ by this share, inline x by FONT px. */
const FONT_SHARE = 0.15;
const FONT = 12;
const reference = JSON.parse(readFileSync(join(dir, `${name}.json`), "utf8"));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: reference.width, height: 1000 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const root = page.locator(selector).first();
// Same state as the capture (hover, focus, active), on the rebuild's root element.
if (reference.state === "hover") await root.hover();
if (reference.state === "focus") await root.focus();
if (reference.state === "active") { await root.hover(); await page.mouse.down(); }
await page.waitForTimeout(300);
const ours = await root.evaluate((rootEl) => {
  const base = rootEl.getBoundingClientRect();
  const out = [];
  const walk = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim();
    if (text && r.width > 0)
      out.push({ text, box: { x: Math.round(r.x - base.x), y: Math.round(r.y - base.y), w: Math.round(r.width), h: Math.round(r.height) },
        style: { fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing } });
    for (const c of el.children) walk(c);
  };
  walk(rootEl);
  return { size: { w: Math.round(base.width), h: Math.round(base.height) }, elements: out };
});
const pad = reference.pad ?? 0;
const box = await root.boundingBox();
await page.screenshot({ path: join(dir, `${name}.rebuild.png`), clip: { x: box.x - pad, y: box.y - pad, width: box.width + pad * 2, height: box.height + pad * 2 } });
await browser.close();

// Reference text elements, normalised the same way ("Intermittent load , 1 GB" -> "Intermittent load, 1 GB").
const norm = (s) => s.replace(/\s+,/g, ",").replace(/\$\s+/g, "$").replace(/\s+/g, " ").trim().toLowerCase();
const refText = reference.elements.filter((e) => e.text);
const used = new Set();
const problems = [];
let matched = 0;
for (const r of refText) {
  const i = ours.elements.findIndex((o, k) => !used.has(k) && norm(o.text) === norm(r.text));
  if (i === -1) {
    problems.push(`missing   "${r.text}"`);
    continue;
  }
  used.add(i);
  matched++;
  const o = ours.elements[i];
  // Text width follows the font: rebuilds use Geist, references use their own faces, so a run of text may be a
  // few percent wider or narrower, and text after it on the same line moves by that much. Vertical position and
  // height stay exact; width and inline x get the font allowance.
  // Same line: tops within 6px (a larger inline run, like a price, sits a few px higher on the shared baseline).
  const follower = refText.some((s) => s !== r && Math.abs(s.box.y - r.box.y) <= 6 && s.box.x < r.box.x);
  // Centred or end-aligned text moves by up to its own width difference.
  const shift = Math.abs(o.box.w - r.box.w);
  const allow = { x: follower ? FONT : Math.max(TOLERANCE, shift), y: TOLERANCE, w: Math.max(TOLERANCE, r.box.w * FONT_SHARE), h: TOLERANCE };
  const off = ["x", "y", "w", "h"].filter((k) => Math.abs(o.box[k] - r.box[k]) > allow[k]);
  if (off.length) problems.push(`box       "${r.text}": ${off.map((k) => `${k} ${r.box[k]} -> ${o.box[k]}`).join(", ")}`);
  for (const k of ["fontSize", "fontWeight", "lineHeight", "letterSpacing"]) {
    const want = r.style[k] ?? (k === "letterSpacing" || k === "lineHeight" ? "normal" : undefined);
    if (want && o.style[k] !== want && !(k === "letterSpacing" && want === "normal" && o.style[k] === "0px")) problems.push(`style     "${r.text}": ${k} ${want} -> ${o.style[k]}`);
  }
}
// Height is exact; width gets the font allowance when the box is sized by its text (buttons, chips).
const sizeOff = Math.abs(ours.size.w - reference.size.w) > Math.max(TOLERANCE, reference.size.w * FONT_SHARE) || Math.abs(ours.size.h - reference.size.h) > TOLERANCE;
if (sizeOff) problems.unshift(`size      ${reference.size.w}x${reference.size.h} -> ${ours.size.w}x${ours.size.h}`);

// Side by side and diff, cropped to the common size.
const a = PNG.sync.read(readFileSync(join(dir, `${name}.png`)));
const b = PNG.sync.read(readFileSync(join(dir, `${name}.rebuild.png`)));
const w = Math.min(a.width, b.width);
const h = Math.min(a.height, b.height);
const crop = (img) => {
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(img, out, 0, 0, w, h, 0, 0);
  return out;
};
const diff = new PNG({ width: w, height: h });
pixelmatch(crop(a).data, crop(b).data, diff.data, w, h, { threshold: 0.2 });
writeFileSync(join(dir, `${name}.diff.png`), PNG.sync.write(diff));
const side = new PNG({ width: a.width + b.width + 16, height: Math.max(a.height, b.height) });
side.data.fill(255);
PNG.bitblt(a, side, 0, 0, a.width, a.height, 0, 0);
PNG.bitblt(b, side, 0, 0, b.width, b.height, a.width + 16, 0);
writeFileSync(join(dir, `${name}.side.png`), PNG.sync.write(side));

console.log(`${name}: ${matched}/${refText.length} text elements matched, ${problems.length} problems`);
for (const p of problems.slice(0, 60)) console.log(`  ${p}`);
process.exit(problems.length ? 1 : 0);
