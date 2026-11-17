"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { toSvg, type Element, type IconEntry } from "./icon-svg";

const PAGE = 240;

/** Search the free Hugeicons set (MIT) and copy any icon as Beam JSX or plain SVG. */
export function IconBrowser() {
  const [icons, setIcons] = useState<IconEntry[] | null>(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [copied, setCopied] = useState<string | null>(null);
  const [format, setFormat] = useState<"jsx" | "svg">("jsx");
  const deferred = useDeferredValue(query);

  useEffect(() => {
    fetch("/ui/icons.json").then((r) => r.json()).then(setIcons, () => setIcons([]));
  }, []);

  const matches = useMemo(() => {
    const words = deferred.toLowerCase().split(/\s+/).filter(Boolean);
    const list = icons ?? [];
    return words.length ? list.filter(([name]) => words.every((w) => name.toLowerCase().includes(w))) : list;
  }, [icons, deferred]);

  const copy = async (name: string, elements: Element[]) => {
    const text = format === "jsx" ? `<Icon icon={${name}} />` : toSvg(elements, 24);
    await navigator.clipboard.writeText(text);
    setCopied(name);
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1400);
  };

  return (
    <div className="not-prose my-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(PAGE);
          }}
          placeholder={icons ? `Search ${icons.length.toLocaleString()} icons` : "Loading icons..."}
          aria-label="Search icons"
          className="h-10 min-w-0 flex-1 rounded-xl border border-[#2a2a2a] bg-[#121212] px-4 text-sm text-[#f5f5f4] outline-none placeholder:text-[#86868c] focus:border-[#ff4fa3]/60"
        />
        <div className="flex rounded-lg bg-white/[0.04] p-0.5 text-xs font-medium" role="radiogroup" aria-label="Copy as">
          {(["jsx", "svg"] as const).map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={format === f}
              onClick={() => setFormat(f)}
              className={`h-8 rounded-md px-3 uppercase ${format === f ? "bg-white/[0.1] text-[#f5f5f4]" : "text-[#a5a5a6]"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-[#86868c]">
        {icons ? `${matches.length.toLocaleString()} icons. Click one to copy it.` : "Loading the icon set..."}
      </p>
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-2">
        {matches.slice(0, limit).map(([name, elements]) => (
          <button
            key={name}
            type="button"
            title={name}
            onClick={() => copy(name, elements)}
            className="group flex h-[104px] flex-col items-center justify-center gap-2.5 rounded-xl border border-[#222] bg-[#141414] px-2 text-[#d4d4d4] transition-colors hover:border-[#3a3a3a] hover:bg-[#1a1a1a] hover:text-white"
          >
            <span className="size-6" dangerouslySetInnerHTML={{ __html: toSvg(elements, 24) }} />
            <span className="w-full truncate text-center text-[11px] text-[#86868c] group-hover:text-[#d4d4d4]">
              {copied === name ? "Copied" : name.replace(/Icon$/, "")}
            </span>
          </button>
        ))}
      </div>
      {matches.length > limit && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + PAGE)}
            className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-[#f5f5f4] hover:bg-[#222]"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
}
