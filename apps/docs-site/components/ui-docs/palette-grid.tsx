"use client";

import { Copy01Icon, Tick02Icon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Palette } from "@beam/ui/palettes/palettes.ts";
import { useRef, useState } from "react";
import { PaletteDetail } from "./palette-detail";

export type Entry = Omit<Palette, "hue" | "tint" | "primary" | "accent">;

/** Dark text on light swatches, light text on dark ones. */
const inkFor = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r! + 0.587 * g! + 0.114 * b! > 150 ? "#111111" : "#ffffff";
};

function useCopied() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400);
  };
  return { copied, copy };
}

const iconButton = "grid size-8 place-items-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground";

/** Enterprise palettes as colour strips. Hover a swatch for its hex, click to copy; View shows it on real components. */
export function PaletteGrid({ palettes }: { palettes: Entry[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const { copied, copy } = useCopied();
  const panel = useRef<HTMLDivElement>(null);
  const selected = palettes.find((p) => p.id === open);

  const view = (id: string) => {
    setOpen(id);
    requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div className="not-prose my-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {palettes.map((p) => (
          <div key={p.id}>
            <div className="flex h-32 overflow-hidden rounded-xl ring-1 ring-fd-border ring-inset">
              {p.display.map((color, i) => (
                <button
                  key={`${color}-${i}`}
                  type="button"
                  title={`Copy ${color}`}
                  onClick={() => copy(`${p.id}-${i}`, color)}
                  className="group/sw relative flex-1 transition-[flex-grow] duration-200 ease-out hover:flex-[1.7]"
                  style={{ background: color }}
                >
                  <span
                    className="absolute inset-x-0 bottom-3 text-center font-mono text-xs font-medium uppercase opacity-0 transition-opacity group-hover/sw:opacity-100"
                    style={{ color: inkFor(color) }}
                  >
                    {copied === `${p.id}-${i}` ? "Copied" : color.slice(1)}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 ps-1">
              <span className="text-[15px] text-fd-foreground">{p.name}</span>
              <span className="flex items-center">
                <button type="button" aria-label={`Copy ${p.name} CSS`} title="Copy CSS" onClick={() => copy(`${p.id}-css`, p.css)} className={iconButton}>
                  <HugeiconsIcon icon={copied === `${p.id}-css` ? Tick02Icon : Copy01Icon} size={16} strokeWidth={1.75} />
                </button>
                <button type="button" aria-label={`View ${p.name}`} title="View" onClick={() => view(p.id)} className={iconButton}>
                  <HugeiconsIcon icon={ViewIcon} size={16} strokeWidth={1.75} />
                </button>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div ref={panel} className="scroll-mt-40">
        {selected && <PaletteDetail palette={selected} copied={copied} copy={copy} />}
      </div>
    </div>
  );
}
