import { describe, expect, it } from "vitest";
import { toLch } from "../palettes/colour.ts";
import { buildPalettes, contrast } from "../palettes/palettes.ts";

// Body text pairs must reach 4.5:1 (WCAG AA). text-3 is for captions and meta, held to 4.5:1 as well.
const PAIRS: Array<[string, string]> = [
  ["text-1", "background"], ["text-2", "background"], ["text-3", "background"],
  ["text-1", "surface-2"], ["text-2", "surface-2"], ["text-3", "surface-2"],
  ["foreground", "card"], ["muted-foreground", "muted"], ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"], ["accent-foreground", "accent"],
  ["link", "background"], ["link", "card"],
  ["success", "success-soft"], ["warning", "warning-soft"], ["danger", "danger-soft"],
];

describe("Beam UI palettes", () => {
  const palettes = buildPalettes();

  it("ships eleven open-source palettes with Graphite as the default, each with the same tokens in light and dark", () => {
    expect(palettes).toHaveLength(11);
    expect(palettes[0]).toMatchObject({ id: "default", name: "Graphite", source: "Radix Colors" });
    expect(new Set(palettes.map((p) => p.id)).size).toBe(11);
    const keys = Object.keys(palettes[0]!.light).sort();
    for (const p of palettes) {
      expect(Object.keys(p.light).sort(), p.id).toEqual(keys);
      expect(Object.keys(p.dark).sort(), p.id).toEqual(keys);
      expect(p.display, p.id).toHaveLength(5);
      expect(p.licence, p.id).toMatch(/^(MIT|Apache-2.0)$/);
      expect(p.url.startsWith("https://github.com/"), p.id).toBe(true);
      expect(p.css, p.id).toContain(`[data-theme="${p.id}"]`);
    }
  });

  it("only moves a colour's lightness when it adjusts one for contrast", () => {
    for (const p of palettes)
      for (const a of p.adjustments) {
        const [, c1, h1] = toLch(a.official);
        const [, c2, h2] = toLch(a.used);
        // Darkening a bright yellow or green clips to sRGB, which bends the hue a little; never more than 15 degrees.
        expect(Math.abs(h1 - h2) < 15 || c1 < 0.02, `${p.id} ${a.token} hue`).toBe(true);
        expect(Math.abs(c1 - c2), `${p.id} ${a.token} chroma`).toBeLessThan(0.06);
      }
  });

  for (const p of palettes)
    for (const mode of ["light", "dark"] as const)
      it(`${p.id} ${mode}: every text pair reaches 4.5:1`, () => {
        const vars = p[mode];
        const failing = PAIRS.map(([fg, bg]) => ({ pair: `${fg} on ${bg}`, ratio: +contrast(vars[fg]!, vars[bg]!).toFixed(2) })).filter((r) => r.ratio < 4.5);
        expect(failing).toEqual([]);
      });
});
