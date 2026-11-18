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
  ["brand-secondary-text", "background"], ["brand-accent-text", "background"], ["info", "info-soft"],
];

describe("Beam UI palettes", () => {
  const palettes = buildPalettes();

  it("ships 111 palettes (11 curated, 100 harmony) with Graphite as the default, each with the same tokens in light and dark", () => {
    expect(palettes).toHaveLength(111);
    expect(palettes[0]).toMatchObject({ id: "default", name: "Graphite", source: "Radix Colors" });
    expect(new Set(palettes.map((p) => p.id)).size).toBe(111);
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

  describe("harmony palettes", () => {
    const harmony = palettes.filter((p) => p.harmony);
    const oklab = (hex: string) => {
      const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
      const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255)) as [number, number, number];
      const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
      const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
      const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
      return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
    };
    const deltaE = (a: string, b: string) => {
      const [p, q] = [oklab(a), oklab(b)];
      return 100 * Math.hypot(p[0]! - q[0]!, p[1]! - q[1]!, p[2]! - q[2]!);
    };

    it("are 25 Radix hues in four colour-harmony schemes", () => {
      expect(harmony).toHaveLength(100);
      const schemes = new Set(harmony.map((p) => p.harmony!.scheme));
      expect([...schemes].sort()).toEqual(["analogous", "complementary", "split-complementary", "triadic"]);
    });

    it("never reuse the primary's own hue for a partner or a semantic colour", () => {
      for (const p of harmony) {
        const h = p.harmony!;
        expect(h.secondary, p.id).not.toBe(h.primary);
        expect(h.accent, p.id).not.toBe(h.primary);
        for (const [role, hue] of Object.entries(h.semantic)) expect(hue, `${p.id} ${role}`).not.toBe(h.primary);
      }
    });

    it("keep the primary, secondary and accent clearly apart", () => {
      for (const p of harmony)
        for (const mode of ["light", "dark"] as const) {
          const t = p[mode];
          expect(deltaE(t.primary!, t["brand-secondary"]!), `${p.id} ${mode} primary/secondary`).toBeGreaterThan(10);
          if (p.harmony!.accent !== p.harmony!.secondary) expect(deltaE(t["brand-secondary"]!, t["brand-accent"]!), `${p.id} ${mode} secondary/accent`).toBeGreaterThan(10);
        }
    });
  });
});
