import { STYLE_KEYS } from "./types.js";

/**
 * Runs inside the page. Kept as a plain string so bundlers never rewrite it.
 * Collects every visible element that carries text, media or a painted box, plus the page's sections.
 */
export const PAGE_SCRIPT = `(() => {
  const KEYS = ${JSON.stringify(STYLE_KEYS)};
  const MAX = 2500;
  const round = (n) => Math.round(n * 10) / 10;
  const pathOf = (el) => {
    const parts = [];
    for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
      const same = node.parentElement ? [...node.parentElement.children].filter((c) => c.tagName === node.tagName) : [node];
      parts.unshift(node.tagName.toLowerCase() + (same.length > 1 ? ":" + (same.indexOf(node) + 1) : ""));
    }
    return parts.join(">");
  };
  const ownText = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" ").replace(/\\s+/g, " ").trim();
  const media = new Set(["IMG", "SVG", "VIDEO", "CANVAS", "PICTURE", "INPUT", "BUTTON", "SELECT", "TEXTAREA", "IFRAME"]);
  const elements = [];
  for (const el of document.body.querySelectorAll("*")) {
    if (elements.length >= MAX) break;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    const text = ownText(el);
    const painted = cs.backgroundColor !== "rgba(0, 0, 0, 0)" || cs.backgroundImage !== "none" || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== "none";
    if (!text && !painted && !media.has(el.tagName.toUpperCase())) continue;
    const style = {};
    for (const key of KEYS) style[key] = cs[key];
    elements.push({
      path: pathOf(el),
      tag: el.tagName.toLowerCase(),
      text: text.slice(0, 120),
      box: { x: round(r.left + scrollX), y: round(r.top + scrollY), width: round(r.width), height: round(r.height) },
      style,
    });
  }
  // Sections: in-flow blocks taller than 40px. Wrappers are opened when one block fills them or they are
  // much taller than the screen and split into several blocks, so a long page yields its real sections.
  const inFlow = (c) => {
    const r = c.getBoundingClientRect();
    const position = getComputedStyle(c).position;
    return r.height > 40 && r.width > 0 && position !== "absolute" && position !== "fixed";
  };
  const expand = (el, depth) => [...el.children].filter(inFlow).flatMap((c) => {
    const inner = [...c.children].filter(inFlow);
    const height = c.getBoundingClientRect().height;
    const wrapper = inner.length === 1 && inner[0].getBoundingClientRect().height >= height * 0.9;
    const tall = height > innerHeight * 1.5 && inner.length >= 2;
    return depth < 6 && (wrapper || tall) ? expand(c, depth + 1) : [c];
  });
  const sections = expand(document.body, 0)
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .sort((a, b) => a.r.top - b.r.top)
    .map(({ el, r }, index) => ({
      index,
      label: (el.id ? "#" + el.id : el.tagName.toLowerCase() + (el.classList[0] ? "." + el.classList[0] : "")) + (el.getAttribute("aria-label") ? " " + el.getAttribute("aria-label") : ""),
      top: Math.round(r.top + scrollY),
      height: Math.round(r.height),
    }));
  return { elements, sections, height: document.documentElement.scrollHeight };
})()`;
