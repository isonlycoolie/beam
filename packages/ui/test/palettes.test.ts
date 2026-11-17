import { describe, expect, it } from "vitest";
import { buildPalettes, contrast } from "../palettes/palettes.ts";

// Body text pairs must reach 4.5:1 (WCAG AA). text-3 is for captions and meta, held to 4.5:1 as well.
const PAIRS: Array<[string, string]> = [
  ["text-1", "background"], ["text-2", "background"], ["text-3", "background"],
  ["text-1", "surface-2"], ["text-2", "surface-2"], ["text-3", "surface-2"],
  ["foreground", "card"], ["muted-foreground", "muted"], ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"], ["accent-foreground", "accent"],
  ["success", "success-soft"], ["warning", "warning-soft"], ["danger", "danger-soft"],
];

describe("Beam UI palettes", () => {
  const palettes = buildPalettes();

  it("ships twelve palettes with Graphite as the default, each with the same tokens in light and dark", () => {
    expect(palettes).toHaveLength(12);
    expect(palettes[0]).toMatchObject({ id: "default", name: "Graphite" });
    const keys = Object.keys(palettes[0]!.light).sort();
    for (const p of palettes) {
      expect(Object.keys(p.light).sort(), p.id).toEqual(keys);
      expect(Object.keys(p.dark).sort(), p.id).toEqual(keys);
      expect(p.display, p.id).toHaveLength(5);
      expect(p.css, p.id).toContain(`[data-theme="${p.id}"]`);
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
