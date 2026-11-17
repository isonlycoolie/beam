/** Facts the review script returns for one breakpoint. */
export type ReviewFacts = {
  contrast: Array<{ element: string; ratio: number; needed: number }>;
  targets: Array<{ element: string; width: number; height: number }>;
  sizes: Record<string, number>;
  spacing: Record<string, number>;
  families: Record<string, number>;
  imagesWithoutAlt: string[];
  overflowX: boolean;
  headings: { h1: number; skips: number };
  gradientText: number;
  lang: string;
};

export type Finding = { severity: "high" | "medium" | "low"; area: string; message: string; fix: string; width?: number };
export type Weight = { bytes: number; requests: number };

/** Same problem on many elements is one finding: "4 elements like span "01" have". */
function group<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) map.set(key(item), [...(map.get(key(item)) ?? []), item]);
  return map;
}
const several = (names: string[], verb: [string, string] = ["has", "have"]) =>
  names.length === 1 ? `${names[0]} ${verb[0]}` : `${names.length} elements like ${names[0]} ${verb[1]}`;

const kb = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

/** Turns measured facts into findings with a concrete fix. Thresholds follow WCAG 2.2 AA and common budgets. */
export function judge(width: number, f: ReviewFacts): Finding[] {
  const out: Finding[] = [];
  const add = (severity: Finding["severity"], area: string, message: string, fix: string) => out.push({ severity, area, message, fix, width });
  for (const [key, items] of group(f.contrast, (c) => `${c.ratio}|${c.needed}`)) {
    const [ratio, needed] = key.split("|");
    add("high", "contrast", `${several(items.map((c) => c.element))} contrast ${ratio}:1, needs ${needed}:1`, "Darken the text or lighten the background until it passes.");
  }
  if (f.overflowX) add("high", "layout", "The page scrolls sideways", "Find the element wider than the screen (fixed widths, long words, wide media) and let it shrink.");
  for (const [size, items] of group(f.targets, (t) => `${t.width}x${t.height}px`))
    add(width <= 480 ? "high" : "medium", "touch", `${several(items.map((t) => t.element), ["is", "are"])} ${size}`, "Make interactive targets at least 24x24px (44x44px is better on phones).");
  if (f.imagesWithoutAlt.length) add("medium", "a11y", `${f.imagesWithoutAlt.length} images have no alt text`, 'Add alt text, or alt="" for decorative images.');
  if (f.headings.h1 !== 1) add("medium", "structure", `The page has ${f.headings.h1} h1 headings`, "Use exactly one h1 for the page title.");
  if (f.headings.skips) add("low", "structure", `Heading levels skip ${f.headings.skips} times`, "Go h1 to h2 to h3 without jumping levels.");
  const families = Object.keys(f.families);
  if (families.length > 2) add("medium", "type", `${families.length} font families: ${families.join(", ")}`, "Use one family, two at most (display plus text).");
  const sizes = Object.keys(f.sizes);
  if (sizes.length > 8) add("medium", "type", `${sizes.length} different font sizes`, "Pick a type scale of 5 to 7 sizes and map every text style onto it.");
  const spacing = Object.keys(f.spacing);
  const offGrid = spacing.filter((v) => parseFloat(v) % 4 !== 0);
  if (spacing.length > 16 || offGrid.length > 4)
    add("low", "spacing", `${spacing.length} spacing values, ${offGrid.length} off a 4px grid (${offGrid.slice(0, 6).join(", ")})`, "Use a spacing scale (4, 8, 12, 16, 24, 32, 48, 64...) so rhythm stays even.");
  if (f.gradientText) add("low", "taste", `${f.gradientText} gradient text elements`, "Gradient text reads as generic AI styling. Keep at most one, for a real reason.");
  if (!f.lang) add("low", "a11y", "The html element has no lang", 'Set <html lang="en"> (or the page language).');
  return out;
}

export function judgeWeight(weight: Weight): Finding[] {
  const out: Finding[] = [];
  if (weight.bytes > 2.5 * 1024 * 1024)
    out.push({ severity: weight.bytes > 5 * 1024 * 1024 ? "high" : "medium", area: "performance", message: `The page loads ${kb(weight.bytes)}`, fix: "Compress images (AVIF/WebP, right size per breakpoint), drop unused fonts and scripts. Aim under 1.5 MB." });
  if (weight.requests > 80)
    out.push({ severity: "low", area: "performance", message: `${weight.requests} network requests`, fix: "Bundle small assets, inline critical icons as SVG, lazy-load below the fold." });
  return out;
}
