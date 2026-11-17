// Finds the element that holds some text on a public page and prints its ancestors with sizes and a selector,
// to pick the --selector for ref-capture.mjs.   node scripts/ref-find.mjs <url> <text>
import { chromium } from "playwright";
const [url, text] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });
console.log(await p.evaluate((text) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = walker.nextNode())) if (n.textContent.trim() === text || n.textContent.includes(text)) break;
  if (!n) return "not found";
  const lines = [];
  for (let el = n.parentElement, i = 0; el && i < 12; el = el.parentElement, i++) {
    const r = el.getBoundingClientRect();
    const path = []; for (let e = el; e && e !== document.body; e = e.parentElement) { const idx = [...e.parentElement.children].indexOf(e) + 1; path.unshift(`${e.tagName.toLowerCase()}:nth-child(${idx})`); }
    lines.push(`${i} ${el.tagName.toLowerCase()} ${Math.round(r.width)}x${Math.round(r.height)} class="${String(el.className).slice(0, 70)}"\n   body > ${path.join(" > ")}`);
  }
  return lines.join("\n");
}, text));
await b.close();
