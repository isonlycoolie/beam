import type { CapturedElement } from "../verify/types.js";

export type TokenCount = { value: string; count: number };
export type TypeStyle = {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  count: number;
  sample: string;
};

/** Every value the page really uses, most used first. The agent copies these; it never invents a scale. */
export type DesignTokens = {
  colors: TokenCount[];
  backgrounds: TokenCount[];
  fontFamilies: TokenCount[];
  typeStyles: TypeStyle[];
  spacing: TokenCount[];
  radii: TokenCount[];
  shadows: TokenCount[];
};

function tally(values: Iterable<string>, skip: (v: string) => boolean = () => false): TokenCount[] {
  const counts = new Map<string, number>();
  for (const value of values) if (value && !skip(value)) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count);
}

const none = (v: string) => v === "none" || v === "0px" || v === "normal" || v === "rgba(0, 0, 0, 0)";

export function extractTokens(elements: CapturedElement[]): DesignTokens {
  const withText = elements.filter((el) => el.text);
  const types = new Map<string, TypeStyle>();
  for (const el of withText) {
    const s = el.style;
    const key = [s.fontFamily, s.fontSize, s.fontWeight, s.lineHeight, s.letterSpacing].join("|");
    const found = types.get(key);
    if (found) found.count += 1;
    else
      types.set(key, {
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        count: 1,
        sample: el.text.slice(0, 40),
      });
  }
  const spacing = elements.flatMap((el) => [el.style.paddingTop, el.style.paddingRight, el.style.paddingBottom, el.style.paddingLeft, el.style.gap]);
  return {
    colors: tally(withText.map((el) => el.style.color)),
    backgrounds: tally(elements.map((el) => el.style.backgroundColor), none),
    fontFamilies: tally(withText.map((el) => el.style.fontFamily)),
    typeStyles: [...types.values()].sort((a, b) => parseFloat(b.fontSize) - parseFloat(a.fontSize)),
    spacing: tally(spacing, none),
    radii: tally(elements.map((el) => el.style.borderRadius), none),
    shadows: tally(elements.map((el) => el.style.boxShadow), none),
  };
}
