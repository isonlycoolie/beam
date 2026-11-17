import { ANY_TAG, STYLE_KEYS, type CapturedElement, type StyleKey } from "./types.js";

export type ElementDelta = {
  path: string;
  tag: string;
  text: string;
  property: "x" | "y" | "width" | "height" | StyleKey;
  expected: string;
  actual: string;
  severity: "high" | "medium";
};

export type ElementDiff = {
  matched: number;
  missing: Array<Pick<CapturedElement, "path" | "tag" | "text">>;
  deltas: ElementDelta[];
};

const ALIGN: Record<string, string> = { start: "left", end: "right" };
/** First font family only, unquoted ("Inter", Arial -> inter); logical text-align read as left/right. */
const normalize = (key: StyleKey, value: string) => {
  if (key === "fontFamily") return (value.split(",")[0] ?? "").replace(/["']/g, "").trim().toLowerCase();
  if (key === "textAlign") return ALIGN[value.trim()] ?? value.trim();
  return value.trim();
};

/** Pairs elements by DOM path first, then by tag + text, so a moved wrapper does not hide a real match. */
export function pairElements(reference: CapturedElement[], target: CapturedElement[]) {
  const byPath = new Map(target.map((el) => [el.path, el]));
  const used = new Set<CapturedElement>();
  const pairs: Array<[CapturedElement, CapturedElement]> = [];
  const unmatched: CapturedElement[] = [];
  for (const ref of reference) {
    const same = byPath.get(ref.path);
    if (same && !used.has(same) && same.tag === ref.tag) {
      used.add(same);
      pairs.push([ref, same]);
    } else unmatched.push(ref);
  }
  const missing: CapturedElement[] = [];
  for (const ref of unmatched) {
    const sameTag = (el: CapturedElement) => ref.tag === ANY_TAG || el.tag === ref.tag;
    const twin = ref.text ? target.find((el) => !used.has(el) && sameTag(el) && el.text === ref.text) : undefined;
    if (twin) {
      used.add(twin);
      pairs.push([ref, twin]);
    } else missing.push(ref);
  }
  return { pairs, missing };
}

export function diffElements(
  reference: CapturedElement[],
  target: CapturedElement[],
  /** boxKeys limits layout checks, for example to y and height when Figma text boxes hug their text. */
  options: { tolerancePx?: number; boxKeys?: Array<"x" | "y" | "width" | "height"> } = {},
): ElementDiff {
  const tolerance = options.tolerancePx ?? 1;
  const { pairs, missing } = pairElements(reference, target);
  const deltas: ElementDelta[] = [];
  for (const [ref, got] of pairs) {
    const base = { path: ref.path, tag: ref.tag, text: ref.text };
    for (const key of options.boxKeys ?? (["x", "y", "width", "height"] as const)) {
      const gap = Math.abs(ref.box[key] - got.box[key]);
      if (gap > tolerance)
        deltas.push({ ...base, property: key, expected: `${ref.box[key]}px`, actual: `${got.box[key]}px`, severity: gap > 8 ? "high" : "medium" });
    }
    for (const key of STYLE_KEYS) {
      // An empty reference value means the source does not define the property (Figma layers).
      if (!ref.style[key]) continue;
      const expected = normalize(key, ref.style[key] ?? "");
      const actual = normalize(key, got.style[key] ?? "");
      if (expected !== actual)
        deltas.push({ ...base, property: key, expected: ref.style[key] ?? "", actual: got.style[key] ?? "", severity: /color|font/i.test(key) ? "high" : "medium" });
    }
  }
  const order = { high: 0, medium: 1 } as const;
  deltas.sort((a, b) => order[a.severity] - order[b.severity]);
  return { matched: pairs.length, missing: missing.map(({ path, tag, text }) => ({ path, tag, text })), deltas };
}
