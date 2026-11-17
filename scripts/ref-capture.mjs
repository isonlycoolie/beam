// Captures one section of a public page as a reference: a screenshot at 1x and 2x, and the computed styles of
// every element inside it, so a rebuild uses measured values instead of guesses (docs/beam-ui/00-rules.md).
//
//   node scripts/ref-capture.mjs <url> <out-dir> <name> [--selector css] [--pick n] [--state hover|focus|active]
//                                [--width 1440] [--pad n] [--page]
//
// --text "Label" [--up n] finds the element by its exact text instead of a selector, then n ancestors up.
// --frame <url part> looks inside that iframe. --click "Text" clicks something first (opens a menu or dialog).
// --pick takes the nth match (0-based). --state puts the element in that state on the live page before capture.
// --pad widens the screenshot by n px on every side (focus rings and shadows sit outside the box); the
// measurements stay relative to the element itself.
//
// --page saves only a full-page screenshot, to find the section and its selector first.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const [url, out, name, ...rest] = process.argv.slice(2);
const flag = (k, d) => (rest.includes(k) ? rest[rest.indexOf(k) + 1] : d);
const width = Number(flag("--width", 1440));
const selector = flag("--selector", "body");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
try {
  for (const scale of rest.includes("--page") ? [1] : [1, 2]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: scale, colorScheme: flag("--scheme", "light") });
    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
    // Run scroll-triggered reveals, then settle animations so the capture is the resting state.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); }
      window.scrollTo(0, 0);
    });
    await page.addStyleTag({ content: "*,*::before,*::after{animation-play-state:paused!important;transition:none!important;caret-color:transparent!important}" });
    await page.waitForTimeout(flag("--frame") ? 10_000 : 1200);
    if (rest.includes("--page")) {
      await page.screenshot({ path: join(out, `${name}.page.png`), fullPage: true });
      console.log(`page: ${join(out, `${name}.page.png`)}`);
      continue;
    }
    const scope = flag("--frame") ? page.frames().find((f) => f.url().includes(flag("--frame"))) : page;
    if (!scope) throw new Error(`No frame matching ${flag("--frame")}`);
    if (flag("--click")) {
      await scope.getByText(flag("--click"), { exact: true }).first().click();
      await page.waitForTimeout(800);
    }
    let section = flag("--text")
      ? scope.getByText(flag("--text"), { exact: true }).nth(Number(flag("--pick", 0)))
      : scope.locator(selector).nth(Number(flag("--pick", 0)));
    for (let i = 0; i < Number(flag("--up", 0)); i++) section = section.locator("xpath=..");
    await section.scrollIntoViewIfNeeded();
    const state = flag("--state");
    if (state === "hover") await section.hover();
    if (state === "focus") await section.focus();
    if (state === "active") { await section.hover(); await page.mouse.down(); }
    await page.waitForTimeout(400);
    const pad = Number(flag("--pad", 0));
    const box = await section.boundingBox();
    await page.screenshot({
      path: join(out, scale === 1 ? `${name}.png` : `${name}@2x.png`),
      clip: { x: box.x - pad, y: box.y - pad, width: box.width + pad * 2, height: box.height + pad * 2 },
    });
    if (scale !== 1) continue;
    // Every visible element: its box relative to the section and the styles that decide how it looks.
    const measured = await section.evaluate((root) => {
      const base = root.getBoundingClientRect();
      const keys = ["display", "position", "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textTransform", "color",
        "backgroundColor", "backgroundImage", "borderTopWidth", "borderTopColor", "borderTopStyle", "borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderColor",
        "borderRadius", "boxShadow", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "gap", "rowGap", "columnGap",
        "gridTemplateColumns", "flexDirection", "justifyContent", "alignItems", "opacity", "textAlign", "fontFeatureSettings", "fontVariantNumeric"];
      const out = [];
      const walk = (el, depth) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || r.width === 0 || r.height === 0) return;
        const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim();
        const style = Object.fromEntries(keys.map((k) => [k, cs[k]]).filter(([, v]) => v && v !== "none" && v !== "normal" && v !== "0px" && v !== "rgba(0, 0, 0, 0)" && v !== "auto"));
        out.push({ depth, tag: el.tagName.toLowerCase(), text: text.slice(0, 80) || undefined,
          box: { x: Math.round(r.x - base.x), y: Math.round(r.y - base.y), w: Math.round(r.width), h: Math.round(r.height) }, style });
        for (const child of el.children) walk(child, depth + 1);
      };
      walk(root, 0);
      return { size: { w: Math.round(base.width), h: Math.round(base.height) }, elements: out };
    });
    writeFileSync(join(out, `${name}.json`), `${JSON.stringify({ url, selector, width, capturedAt: new Date().toISOString(), ...measured }, null, 1)}\n`);
    console.log(`${name}: ${measured.size.w}x${measured.size.h}, ${measured.elements.length} elements -> ${out}`);
  }
} finally {
  await browser.close();
}
