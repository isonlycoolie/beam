"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { IconToolbar, type Index, type Weight } from "./icon-parts";
import { toSvg, type Element } from "./icon-svg";

const PAGE = 300;

/**
 * The free Hugeicons set (Stroke Rounded, MIT) as a clean grid, for one category or all of them. No names on the
 * tiles: hover shows the name, a click copies it as Beam JSX or plain SVG at the chosen stroke weight.
 */
export function IconBrowser({ category = null }: { category?: number | null }) {
  const [index, setIndex] = useState<Index | null>(null);
  const [query, setQuery] = useState("");
  const [weight, setWeight] = useState<Weight>(1.5);
  const [format, setFormat] = useState<"jsx" | "svg">("jsx");
  const [limit, setLimit] = useState(PAGE);
  const [copied, setCopied] = useState<string | null>(null);
  const deferred = useDeferredValue(query);

  useEffect(() => {
    fetch("/ui/icons.json").then((r) => r.json()).then(setIndex, () => setIndex({ categories: [], icons: [] }));
  }, []);

  const inCategory = useMemo(() => (index?.icons ?? []).filter(([, , cat]) => category === null || cat === category), [index, category]);
  const matches = useMemo(() => {
    const words = deferred.toLowerCase().split(/\s+/).filter(Boolean);
    return words.length ? inCategory.filter(([name]) => words.every((w) => name.toLowerCase().includes(w))) : inCategory;
  }, [inCategory, deferred]);

  const copy = async (name: string, elements: Element[]) => {
    const props = weight === 1.5 ? "" : ` weight={${weight}}`;
    await navigator.clipboard.writeText(format === "jsx" ? `<Icon icon={${name}}${props} />` : toSvg(elements, 24, weight));
    setCopied(name);
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1600);
  };

  return (
    <div className="not-prose my-6">
      <IconToolbar
        query={query}
        setQuery={(q) => {
          setQuery(q);
          setLimit(PAGE);
        }}
        placeholder={index ? `Search ${inCategory.length.toLocaleString()} icons` : "Loading icons..."}
        weight={weight}
        setWeight={setWeight}
        format={format}
        setFormat={setFormat}
      />
      <p className="mt-4 mb-3 text-sm text-fd-muted-foreground">
        {index ? `${matches.length.toLocaleString()} icons` : "Loading the icon set..."}
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2">
        {matches.slice(0, limit).map(([name, elements]) => (
          <button
            key={name}
            type="button"
            title={name.replace(/Icon$/, "")}
            aria-label={`Copy ${name}`}
            onClick={() => copy(name, elements)}
            className={`grid aspect-square place-items-center rounded-xl border transition-colors ${
              copied === name
                ? "border-fd-foreground/40 bg-fd-accent text-fd-foreground"
                : "border-fd-border text-fd-foreground/85 hover:border-fd-foreground/25 hover:bg-fd-accent hover:text-fd-foreground"
            }`}
          >
            <span className="size-6" dangerouslySetInnerHTML={{ __html: toSvg(elements, 24, weight) }} />
          </button>
        ))}
      </div>
      {matches.length > limit && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + PAGE)}
            className="h-10 rounded-lg border border-fd-border px-4 text-sm font-medium text-fd-foreground hover:bg-fd-accent"
          >
            Show more
          </button>
        </div>
      )}
      {/* One quiet confirmation instead of names on every tile. */}
      <div
        role="status"
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-fd-border bg-fd-popover px-4 py-2 text-sm text-fd-foreground shadow-lg transition-opacity ${copied ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        Copied <span className="font-mono text-[13px]">{copied}</span>
      </div>
    </div>
  );
}
