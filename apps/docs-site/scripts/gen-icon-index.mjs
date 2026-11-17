// Writes public/ui/icons.json: every icon in the free Hugeicons set (Stroke Rounded, MIT) with its SVG elements
// and a category, fetched only by the Browse pages so the rest of the docs never load it.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as icons from "@hugeicons/core-free-icons";
import { CATEGORIES as SOURCES, slugOf } from "../lib/icon-categories.mjs";

/** Attributes almost every path repeats. Kept in sync with components/ui-docs/icon-svg.ts. */
const DEFAULTS = { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" };

const CATEGORIES = SOURCES.map(([name, words]) => [name, new Set(words.split(" "))]);
const OTHER = CATEGORIES.length;
const DIRECTIONS = new Set("left right up down top bottom vertical horizontal diagonal go".split(" "));

const words = (name) =>
  name
    .replace(/Icon$/, "")
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .toLowerCase()
    .split(/[\s\d]+/)
    .filter(Boolean);
const categoryOf = (name) => {
  const w = words(name);
  const i = CATEGORIES.findIndex(([, set]) => w.some((word) => set.has(word)));
  if (i !== -1) return i;
  return w.some((word) => DIRECTIONS.has(word)) ? CATEGORIES.findIndex(([name]) => name === "Arrows") : OTHER;
};

const entries = Object.entries(icons)
  .filter(([name, value]) => name.endsWith("Icon") && Array.isArray(value))
  .sort(([a], [b]) => a.localeCompare(b))
  // Drop React's "key" and every attribute equal to the set's defaults (DEFAULTS); the page adds them back.
  .map(([name, elements]) => [
    name,
    elements.map(([tag, attrs]) => [tag, Object.fromEntries(Object.entries(attrs).filter(([k, v]) => k !== "key" && DEFAULTS[k] !== v))]),
    categoryOf(name),
  ]);
const dir = fileURLToPath(new URL("../public/ui/", import.meta.url));
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}icons.json`, JSON.stringify({ categories: [...CATEGORIES.map(([name]) => name), "Other"], icons: entries }));
const counts = entries.reduce((acc, [, , c]) => ((acc[c] = (acc[c] ?? 0) + 1), acc), {});
console.log(`icons: ${entries.length}, uncategorised: ${counts[OTHER] ?? 0}`);

// Every category must be a sidebar link, or its icons can't be reached.
const meta = readFileSync(fileURLToPath(new URL("../content/docs/icons/meta.json", import.meta.url)), "utf8");
const missing = [...CATEGORIES.map(([name]) => name), "Other"].filter((name) => !meta.includes(`/docs/icons/browse/${slugOf(name)})`));
if (missing.length) throw new Error(`content/docs/icons/meta.json is missing Browse links for: ${missing.join(", ")}`);
