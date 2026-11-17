"use client";

import type { Element } from "./icon-svg";

export type Index = { categories: string[]; icons: Array<[name: string, elements: Element[], category: number]> };
export const WEIGHTS = [1, 1.5, 2] as const;
export type Weight = (typeof WEIGHTS)[number];

export const pill = (active: boolean) =>
  `h-8 rounded-lg border px-3 text-sm font-medium transition-colors ${
    active ? "border-fd-foreground/25 bg-fd-accent text-fd-foreground" : "border-fd-border text-fd-muted-foreground hover:text-fd-foreground"
  }`;

/** Style (the free set has one), stroke weight and copy format. */
export function IconToolbar({ weight, setWeight, format, setFormat }: { weight: Weight; setWeight: (w: Weight) => void; format: "jsx" | "svg"; setFormat: (f: "jsx" | "svg") => void }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-fd-border pb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-fd-foreground">Style:</span>
        <span className={`${pill(true)} inline-flex items-center gap-2`}>
          Stroke Rounded
          <span className="rounded bg-fd-foreground/10 px-1.5 py-px text-[11px] text-fd-muted-foreground">Free</span>
        </span>
      </div>
      <div className="flex items-center gap-2" role="radiogroup" aria-label="Stroke weight">
        <span className="text-sm font-semibold text-fd-foreground">Weight:</span>
        {WEIGHTS.map((w) => (
          <button key={w} type="button" role="radio" aria-checked={weight === w} onClick={() => setWeight(w)} className={pill(weight === w)}>
            {w}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2" role="radiogroup" aria-label="Copy as">
        <span className="text-sm font-semibold text-fd-foreground">Copy as:</span>
        {(["jsx", "svg"] as const).map((f) => (
          <button key={f} type="button" role="radio" aria-checked={format === f} onClick={() => setFormat(f)} className={`${pill(format === f)} uppercase`}>
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}

/** "All icons" and each category with its count; a row that scrolls on phones, a sticky list on desktop. */
export function IconCategories({ index, counts, category, pick }: { index: Index | null; counts: Map<number, number>; category: number | null; pick: (c: number | null) => void }) {
  return (
    <nav aria-label="Icon categories" className="shrink-0 md:sticky md:top-28 md:w-52 md:self-start">
      <p className="mb-2 text-sm font-semibold text-fd-foreground">Categories</p>
      <ul className="flex gap-1 overflow-x-auto pb-2 md:max-h-[70vh] md:flex-col md:overflow-y-auto md:pb-0">
        {[null, ...(index?.categories.map((_, i) => i) ?? [])].map((c) => (
          <li key={c ?? "all"}>
            <button
              type="button"
              onClick={() => pick(c)}
              className={`flex w-full items-center justify-between gap-4 whitespace-nowrap rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                category === c ? "bg-fd-accent text-fd-foreground" : "text-fd-muted-foreground hover:text-fd-foreground"
              }`}
            >
              {c === null ? "All icons" : index?.categories[c]}
              <span className="text-xs tabular-nums text-fd-muted-foreground">{c === null ? index?.icons.length : counts.get(c)}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
