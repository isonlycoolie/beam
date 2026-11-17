"use client";

import type { Element } from "./icon-svg";

export type Index = { categories: string[]; icons: Array<[name: string, elements: Element[], category: number]> };
export const WEIGHTS = [1, 1.5, 2] as const;
export type Weight = (typeof WEIGHTS)[number];

/** A segmented control: one bordered group, the chosen option filled. */
function Segmented<T extends string | number>({ label, options, value, onChange, format = String }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void; format?: (v: T) => string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex h-10 shrink-0 items-center rounded-lg border border-fd-border p-0.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={value === option}
          onClick={() => onChange(option)}
          className={`h-full min-w-10 rounded-md px-3 text-sm font-medium transition-colors ${
            value === option ? "bg-fd-accent text-fd-foreground" : "text-fd-muted-foreground hover:text-fd-foreground"
          }`}
        >
          {format(option)}
        </button>
      ))}
    </div>
  );
}

/** Search, stroke weight and copy format on one row. Categories live in the sidebar. */
export function IconToolbar({ query, setQuery, placeholder, weight, setWeight, format, setFormat }: {
  query: string;
  setQuery: (q: string) => void;
  placeholder: string;
  weight: Weight;
  setWeight: (w: Weight) => void;
  format: "jsx" | "svg";
  setFormat: (f: "jsx" | "svg") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search icons"
        className="h-10 min-w-0 flex-1 basis-64 rounded-lg border border-fd-border bg-transparent px-3.5 text-sm text-fd-foreground outline-none placeholder:text-fd-muted-foreground focus:border-fd-foreground/30"
      />
      <Segmented label="Stroke weight" options={WEIGHTS} value={weight} onChange={setWeight} />
      <Segmented label="Copy as" options={["jsx", "svg"] as const} value={format} onChange={setFormat} format={(f) => f.toUpperCase()} />
    </div>
  );
}
