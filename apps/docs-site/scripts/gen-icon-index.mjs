// Writes public/ui/icons.json: every icon in the free Hugeicons set (MIT) as [name, svg-elements],
// fetched only by the Icons page so the rest of the docs never load it.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as icons from "@hugeicons/core-free-icons";

/** Attributes almost every path repeats. Kept in sync with icon-browser.tsx. */
const DEFAULTS = { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" };

const entries = Object.entries(icons)
  .filter(([name, value]) => name.endsWith("Icon") && Array.isArray(value))
  .sort(([a], [b]) => a.localeCompare(b))
  // Drop React's "key" and every attribute equal to the set's defaults (DEFAULTS); the page adds them back.
  .map(([name, elements]) => [name, elements.map(([tag, attrs]) => [tag, Object.fromEntries(Object.entries(attrs).filter(([k, v]) => k !== "key" && DEFAULTS[k] !== v))])]);
const dir = fileURLToPath(new URL("../public/ui/", import.meta.url));
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}icons.json`, JSON.stringify(entries));
console.log(`icons: ${entries.length}`);
