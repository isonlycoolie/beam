/**
 * Beam UI palettes: established open-source palettes (Radix Colors, IBM Carbon, Catppuccin, Rosé Pine, Flexoki)
 * mapped onto Beam's tokens with the role each source documents for every colour (sources.ts).
 * Where an official colour misses 4.5:1 for a text pair, only its lightness moves until it reads, and the change
 * is recorded so the docs show both the official and the used value.
 */
import { contrast, hex, readable, toLch, type Lch } from "./colour.ts";
import { PALETTES, type PaletteSource } from "./sources.ts";

export { contrast, hex, PALETTES, type Lch, type PaletteSource };

export type Adjustment = { mode: "light" | "dark"; token: string; official: string; used: string };

// Each text token and every background it must read on.
const PAIRS: Array<[string, string[]]> = [
  ["text-1", ["background", "surface-2", "card", "secondary", "accent"]],
  ["text-2", ["background", "surface-2", "card", "muted"]],
  ["text-3", ["background", "surface-2", "card"]],
  // The accent as text: links and "featured" labels.
  ["link", ["background", "surface-2", "card"]],
  // The harmony partners and info as text.
  ["brand-secondary-text", ["background", "card"]],
  ["brand-accent-text", ["background", "card"]],
  ["info", ["info-soft", "background"]],
  ["success", ["success-soft"]],
  ["warning", ["warning-soft"]],
  ["danger", ["danger-soft"]],
];

/** Moves `token` only as far as it must to read on every background in `on`. */
function settle(t: Record<string, string>, token: string, on: string[], mode: "light" | "dark", log: Adjustment[]) {
  const official = t[token]!;
  let used = official;
  for (let i = 0; i < 3; i++) {
    const worst = on.map((bg) => t[bg]!).sort((a, b) => contrast(used, a) - contrast(used, b))[0]!;
    if (contrast(used, worst) >= 4.5) break;
    used = readable(toLch(used), worst);
  }
  if (used !== official) {
    t[token] = used;
    log.push({ mode, token, official, used });
  }
}

function tokens(p: PaletteSource, mode: "light" | "dark", log: Adjustment[]): Record<string, string> {
  const t = { ...p[mode] };
  // Curated palettes predate the harmony roles: give them the colours they already use in those places.
  t["brand-secondary"] ??= t["chart-2"]!;
  t["brand-secondary-soft"] ??= t.accent!;
  t["brand-secondary-text"] ??= t.link!;
  t["brand-accent"] ??= t["chart-3"]!;
  t["brand-accent-soft"] ??= t.accent!;
  t["brand-accent-text"] ??= t.link!;
  t.info ??= t.link!;
  t["info-soft"] ??= t.accent!;
  // On the primary: the official candidate with the best contrast; if none reaches 4.5:1, the primary moves.
  const on = p.onPrimary[mode].slice().sort((a, b) => contrast(b, t.primary!) - contrast(a, t.primary!))[0]!;
  t["primary-foreground"] = on;
  settle(t, "primary", ["primary-foreground"], mode, log);
  for (const [token, backgrounds] of PAIRS) settle(t, token, backgrounds, mode, log);
  for (const key of ["foreground", "card-foreground", "popover-foreground", "secondary-foreground", "accent-foreground"]) t[key] = t["text-1"]!;
  t["muted-foreground"] = t["text-2"]!;
  t.destructive = t.danger!;
  return t;
}

export type Palette = PaletteSource & { css: string; adjustments: Adjustment[] };

const block = (selector: string, vars: Record<string, string>, scheme: string) =>
  `${selector} {\n  color-scheme: ${scheme};\n${Object.entries(vars)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n")}\n}\n`;

export function buildPalette(p: PaletteSource): Palette {
  const adjustments: Adjustment[] = [];
  const light = tokens(p, "light", adjustments);
  const dark = tokens(p, "dark", adjustments);
  const sel = `[data-theme="${p.id}"]`;
  const css = [
    `/* Beam UI palette: ${p.name}. ${p.description} Source: ${p.source} (${p.licence}), ${p.url}. */\n`,
    block(sel, light, "light"),
    "/* Dark: on the element itself (.dark) or inside a .dark ancestor, unless the element asks for .light. */",
    block(`${sel}.dark,\n.dark ${sel}:not(.light)`, dark, "dark"),
  ].join("\n");
  return { ...p, light, dark, css, adjustments };
}

export const buildPalettes = (): Palette[] => PALETTES.map(buildPalette);
