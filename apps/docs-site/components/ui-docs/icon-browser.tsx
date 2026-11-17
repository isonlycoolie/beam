"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { toSvg, type Element } from "./icon-svg";
import { IconCategories, IconToolbar, pill, type Index, type Weight } from "./icon-parts";

const PAGE = 300;

/**
 * Every free Hugeicons icon (Stroke Rounded, MIT), by category. No names on the tiles: hover shows the name,
 * a click copies it as Beam JSX or plain SVG at the chosen stroke weight.
 */
export function IconBrowser() {
  const [index, setIndex] = useState<Index | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<number | null>(null);
  const [weight, setWeight] = useState<Weight>(1.5);
  const [format, setFormat] = useState<"jsx" | "svg">("jsx");
  const [limit, setLimit] = useState(PAGE);
  const [copied, setCopied] = useState<string | null>(null);
  const deferred = useDeferredValue(query);

  useEffect(() => {
    fetch("/ui/icons.json").then((r) => r.json()).then(setIndex, () => setIndex({ categories: [], icons: [] }));
  }, []);

  const counts = useMemo(() => {
    const c = new Map<number, number>();
    for (const [, , cat] of index?.icons ?? []) c.set(cat, (c.get(cat) ?? 0) + 1);
    return c;
  }, [index]);

  const matches = useMemo(() => {
    const words = deferred.toLowerCase().split(/\s+/).filter(Boolean);
    return (index?.icons ?? []).filter(
      ([name, , cat]) => (category === null || cat === category) && words.every((w) => name.toLowerCase().includes(w)),
    );
  }, [index, deferred, category]);

  const copy = async (name: string, elements: Element[]) => {
    const props = weight === 1.5 ? "" : ` weight={${weight}}`;
    await navigator.clipboard.writeText(format === "jsx" ? `<Icon icon={${name}}${props} />` : toSvg(elements, 24, weight));
    setCopied(name);
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1600);
  };

  const pick = (c: number | null) => {
    setCategory(c);
    setLimit(PAGE);
  };

  return (
    <div className="not-prose my-6">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setLimit(PAGE);
        }}
        placeholder={index ? `Search ${index.icons.length.toLocaleString()} icons` : "Loading icons..."}
        aria-label="Search icons"
        className="h-11 w-full rounded-xl border border-fd-border bg-transparent px-4 text-[15px] text-fd-foreground outline-none placeholder:text-fd-muted-foreground focus:border-fd-foreground/30"
      />

      <IconToolbar weight={weight} setWeight={setWeight} format={format} setFormat={setFormat} />

      <div className="mt-6 flex flex-col gap-8 md:flex-row">
        <IconCategories index={index} counts={counts} category={category} pick={pick} />

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-baseline gap-3">
            <h2 className="text-xl font-semibold text-fd-foreground">{category === null ? "All icons" : index?.categories[category]}</h2>
            <span className="text-sm text-fd-muted-foreground">
              {index ? `${matches.length.toLocaleString()} icons. Hover for the name, click to copy.` : "Loading the icon set..."}
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-2">
            {matches.slice(0, limit).map(([name, elements]) => (
              <button
                key={name}
                type="button"
                title={name.replace(/Icon$/, "")}
                aria-label={`Copy ${name}`}
                onClick={() => copy(name, elements)}
                className={`grid aspect-square place-items-center rounded-xl border transition-colors ${
                  copied === name ? "border-fd-foreground/40 bg-fd-accent text-fd-foreground" : "border-fd-border bg-fd-card/40 text-fd-foreground/85 hover:border-fd-foreground/25 hover:bg-fd-accent hover:text-fd-foreground"
                }`}
              >
                <span className="size-6" dangerouslySetInnerHTML={{ __html: toSvg(elements, 24, weight) }} />
              </button>
            ))}
          </div>
          {matches.length > limit && (
            <div className="mt-6 flex justify-center">
              <button type="button" onClick={() => setLimit((l) => l + PAGE)} className={pill(false)}>
                Show more
              </button>
            </div>
          )}
        </div>
      </div>

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
