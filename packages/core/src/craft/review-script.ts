/**
 * Runs inside the page and gathers the facts the craft review judges: text contrast against the real
 * painted background, interactive target sizes, overflow, images without alt, headings and type/spacing use.
 */
export const REVIEW_SCRIPT = `(() => {
  const parse = (c) => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const backgroundOf = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage !== "none") return null;
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0.95) return c;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const label = (el) => el.tagName.toLowerCase() + (el.textContent ? ' "' + el.textContent.trim().replace(/\\s+/g, " ").slice(0, 40) + '"' : "");
  const contrast = [], targets = [], sizes = {}, spacing = {}, families = {};
  for (const el of document.body.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (cs.display === "none" || cs.visibility === "hidden" || r.width === 0 || r.height === 0) continue;
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (own) {
      sizes[cs.fontSize] = (sizes[cs.fontSize] || 0) + 1;
      const family = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim();
      families[family] = (families[family] || 0) + 1;
      const fg = parse(cs.color), bg = backgroundOf(el);
      if (fg && bg && Number(cs.opacity) > 0) {
        const value = ratio(fg, bg);
        const large = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && Number(cs.fontWeight) >= 700);
        if (value < (large ? 3 : 4.5)) contrast.push({ element: label(el), ratio: Math.round(value * 100) / 100, needed: large ? 3 : 4.5 });
      }
    }
    for (const side of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "gap", "marginTop", "marginBottom"]) {
      const v = cs[side];
      if (v && v !== "0px" && v !== "normal" && v.endsWith("px")) spacing[v] = (spacing[v] || 0) + 1;
    }
    if (el.matches("a[href],button,input,select,textarea,[role=button]") && (r.width < 24 || r.height < 24))
      targets.push({ element: label(el), width: Math.round(r.width), height: Math.round(r.height) });
  }
  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => Number(h.tagName[1]));
  const skips = headings.filter((level, i) => i > 0 && level > headings[i - 1] + 1).length;
  return {
    contrast, targets, sizes, spacing, families,
    imagesWithoutAlt: [...document.images].filter((img) => !img.hasAttribute("alt")).map((img) => img.currentSrc.split("/").pop()),
    overflowX: document.documentElement.scrollWidth > innerWidth + 1,
    headings: { h1: headings.filter((l) => l === 1).length, skips },
    gradientText: [...document.querySelectorAll("*")].filter((el) => getComputedStyle(el).backgroundClip === "text").length,
    lang: document.documentElement.lang,
  };
})()`;
