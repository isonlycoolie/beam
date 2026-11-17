import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const dir = join(import.meta.dirname, "..", "themes");

/** Parses the two blocks of a theme file (light, then dark) into variable maps. */
function palettes(file: string): Array<{ mode: string; vars: Record<string, string> }> {
  const css = readFileSync(join(dir, file), "utf8");
  return [...css.matchAll(/\{([^}]*)\}/g)].map((m, i) => ({
    mode: i === 0 ? "light" : "dark",
    vars: Object.fromEntries([...m[1]!.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((v) => [v[1]!, v[2]!])),
  }));
}

function luminance(hex: string): number {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
}
const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
};

// Body text pairs must reach 4.5:1 (WCAG AA). text-3 is for captions and meta, held to 4.5:1 as well.
const PAIRS: Array<[string, string]> = [
  ["text-1", "background"], ["text-2", "background"], ["text-3", "background"],
  ["text-1", "surface-2"], ["text-2", "surface-2"], ["text-3", "surface-2"],
  ["foreground", "card"], ["muted-foreground", "muted"], ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"], ["accent-foreground", "accent"],
  ["success", "success-soft"], ["warning", "warning-soft"], ["danger", "danger-soft"],
];

describe("Beam UI themes", () => {
  const files = readdirSync(dir).filter((f) => f.endsWith(".css"));

  it("ships four themes, each with a light and a dark palette", () => {
    expect(files.sort()).toEqual(["beam.css", "clinic.css", "ledger.css", "studio.css"]);
    for (const file of files) expect(palettes(file).map((p) => p.mode)).toEqual(["light", "dark"]);
  });

  for (const file of files)
    for (const { mode, vars } of palettes(file))
      it(`${file} ${mode}: every text pair reaches 4.5:1`, () => {
        const failing = PAIRS.map(([fg, bg]) => ({ pair: `${fg} on ${bg}`, ratio: +contrast(vars[fg]!, vars[bg]!).toFixed(2) })).filter((r) => r.ratio < 4.5);
        expect(failing).toEqual([]);
      });
});
