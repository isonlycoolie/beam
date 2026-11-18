"use client";

import { LiquidGlass } from "@beam/ui/components/liquid-glass";
import { useState } from "react";
import { GLASS_PHOTO } from "./surface-toggle";

const CONTROLS = [
  { key: "bend", label: "Bend", min: 0, max: 2.5, step: 0.05, unit: "" },
  { key: "dispersion", label: "Dispersion", min: 0, max: 2, step: 0.05, unit: "" },
  { key: "frost", label: "Frost", min: 0, max: 20, step: 0.5, unit: "px" },
  { key: "rim", label: "Rim", min: 0, max: 1, step: 0.01, unit: "" },
] as const;
type Key = (typeof CONTROLS)[number]["key"];
const DEFAULTS: Record<Key, number> = { bend: 1, dispersion: 0.6, frost: 3, rim: 0.3 };

/** Liquid Glass's four controls on a live pill over a photo, with the CSS that sets them. */
export function LiquidGlassTuner() {
  const [v, setV] = useState(DEFAULTS);
  return (
    <div data-preview="" className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border">
      <div className="flex h-[300px] items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${GLASS_PHOTO})` }}>
        <LiquidGlass pressable bend={v.bend} dispersion={v.dispersion} frost={v.frost} rim={v.rim} className="px-10 py-6">
          <span className="text-[17px] leading-[22px] font-semibold text-text-1">Liquid glass</span>
        </LiquidGlass>
      </div>
      <div className="grid gap-4 border-t border-fd-border p-4 sm:grid-cols-2">
        {CONTROLS.map((c) => (
          <label key={c.key} className="flex items-center gap-3 text-[13px] text-fd-foreground">
            <span className="w-20 shrink-0 font-medium">{c.label}</span>
            <input
              type="range"
              min={c.min}
              max={c.max}
              step={c.step}
              value={v[c.key]}
              onChange={(e) => setV({ ...v, [c.key]: Number(e.target.value) })}
              className="min-w-0 flex-1 accent-fd-foreground"
            />
            <span className="w-12 shrink-0 text-right tabular-nums text-fd-muted-foreground">
              {v[c.key]}
              {c.unit}
            </span>
          </label>
        ))}
      </div>
      <pre className="overflow-x-auto border-t border-fd-border bg-fd-card/40 p-4 text-[12.5px] leading-[20px]">
        <code>{`.my-glass {\n  --beam-glass-bend: ${v.bend};\n  --beam-glass-dispersion: ${v.dispersion};\n  --beam-glass-frost: ${v.frost}px;\n  --beam-glass-rim: ${v.rim};\n}`}</code>
      </pre>
      <div className="flex justify-end border-t border-fd-border px-4 py-2">
        <button type="button" onClick={() => setV(DEFAULTS)} className="text-[13px] font-medium text-fd-muted-foreground hover:text-fd-foreground">
          Reset to iOS
        </button>
      </div>
    </div>
  );
}
