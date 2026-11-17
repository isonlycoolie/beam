// Colour maths for palettes: OKLCH to sRGB hex, WCAG contrast, and nudging a colour until it reads.
export type Lch = readonly [l: number, c: number, h: number];

/** OKLCH to #rrggbb, clamped to sRGB. */
export function hex([l, c, h]: Lch): string {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
  return `#${rgb
    .map((v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055))
    .map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function luminance(color: string): number {
  const c = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
}

export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
}

/** Moves a colour's lightness away from its background until the pair reads at 4.6:1. */
export function readable(fg: Lch, bg: string): string {
  const darker = luminance(bg) > 0.18;
  let [l, c, h] = fg;
  while (contrast(hex([l, c, h]), bg) < 4.6 && l > 0.02 && l < 0.99) l += darker ? -0.01 : 0.01;
  return hex([l, c, h]);
}
