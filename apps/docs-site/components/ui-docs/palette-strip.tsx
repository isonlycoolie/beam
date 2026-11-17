"use client";

import { useState } from "react";

/** Dark text on light swatches, light text on dark ones. */
const inkFor = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r! + 0.587 * g! + 0.114 * b! > 150 ? "#111111" : "#ffffff";
};

/** Five colours in one strip. Hover a swatch for its hex, click to copy it. */
export function PaletteStrip({ colors, height = "h-32" }: { colors: string[]; height?: string }) {
  const [copied, setCopied] = useState<number | null>(null);
  return (
    <div className={`flex ${height} overflow-hidden rounded-xl ring-1 ring-fd-border ring-inset`}>
      {colors.map((color, i) => (
        <button
          key={`${color}-${i}`}
          type="button"
          title={`Copy ${color}`}
          onClick={async (e) => {
            e.preventDefault();
            await navigator.clipboard.writeText(color);
            setCopied(i);
            setTimeout(() => setCopied((c) => (c === i ? null : c)), 1400);
          }}
          className="group/sw relative flex-1 transition-[flex-grow] duration-200 ease-out hover:flex-[1.7]"
          style={{ background: color }}
        >
          <span
            className="absolute inset-x-0 bottom-3 text-center font-mono text-xs font-medium uppercase opacity-0 transition-opacity group-hover/sw:opacity-100"
            style={{ color: inkFor(color) }}
          >
            {copied === i ? "Copied" : color.slice(1)}
          </span>
        </button>
      ))}
    </div>
  );
}
