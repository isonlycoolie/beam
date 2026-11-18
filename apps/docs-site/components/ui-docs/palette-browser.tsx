"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PaletteStrip } from "./palette-strip";

export type PaletteCard = { id: string; name: string; source: string; family: string; scheme: string; display: string[] };

const SCHEMES = [
  ["all", "All schemes"],
  ["curated", "Curated"],
  ["complementary", "Complementary"],
  ["analogous", "Analogous"],
  ["triadic", "Triadic"],
  ["split-complementary", "Split-complementary"],
] as const;

function Chips({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: readonly (readonly [string, string])[];
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={`rounded-full border px-3 py-1 text-[13px] transition-colors ${
            value === v ? "border-fd-foreground bg-fd-foreground text-fd-background" : "border-fd-border text-fd-muted-foreground hover:text-fd-foreground"
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

/** The palette index: pick a colour family and a harmony scheme, or browse all. */
export function PaletteBrowser({ cards }: { cards: PaletteCard[] }) {
  const [family, setFamily] = useState("all");
  const [scheme, setScheme] = useState("all");
  const families = useMemo(() => [["all", "All colours"], ...[...new Set(cards.map((c) => c.family))].map((f) => [f, f] as const)] as const, [cards]);
  const shown = cards.filter((c) => (family === "all" || c.family === family) && (scheme === "all" || c.scheme === scheme));
  return (
    <div className="not-prose my-8">
      <div className="flex flex-col gap-3">
        <Chips label="Colour family" value={family} onChange={setFamily} options={families as unknown as readonly (readonly [string, string])[]} />
        <Chips label="Harmony scheme" value={scheme} onChange={setScheme} options={SCHEMES} />
        <p className="text-[13px] text-fd-muted-foreground">{shown.length} palettes</p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((p) => (
          <div key={p.id}>
            <PaletteStrip colors={p.display} />
            <Link href={`/docs/palettes/${p.id}`} className="group mt-2.5 flex flex-col gap-0.5 px-1">
              <span className="text-[15px] text-fd-foreground group-hover:underline group-hover:underline-offset-4">{p.name}</span>
              <span className="text-xs text-fd-muted-foreground">{p.source}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
