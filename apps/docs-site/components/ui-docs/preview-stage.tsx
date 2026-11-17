"use client";

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, type ReactNode } from "react";
import { THEMES, usePrefs } from "./use-preview-prefs";

const chip = "h-7 rounded-md px-2.5 text-xs font-medium transition-colors";

/** The live stage: theme, light or dark, and density switch every preview at once. */
export function PreviewStage({ children, code, minHeight = 280 }: { children: ReactNode; code?: ReactNode; minHeight?: number }) {
  const [prefs, update] = usePrefs();
  const [open, setOpen] = useState(false);
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#121212]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#2a2a2a] px-3 py-2">
        <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] p-0.5" role="radiogroup" aria-label="Theme">
          {THEMES.map((theme) => (
            <button
              key={theme}
              type="button"
              role="radio"
              aria-checked={prefs.theme === theme}
              onClick={() => update({ theme })}
              className={`${chip} capitalize ${prefs.theme === theme ? "bg-white/[0.1] text-[#f5f5f4]" : "text-[#a5a5a6] hover:text-[#f5f5f4]"}`}
            >
              {theme}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => update({ density: prefs.density === "compact" ? "comfortable" : "compact" })}
          className={`${chip} text-[#a5a5a6] hover:text-[#f5f5f4]`}
        >
          {prefs.density === "compact" ? "Compact" : "Comfortable"}
        </button>
        <button
          type="button"
          aria-label={prefs.mode === "dark" ? "Switch to light" : "Switch to dark"}
          onClick={() => update({ mode: prefs.mode === "dark" ? "light" : "dark" })}
          className="ms-auto grid size-7 place-items-center rounded-md text-[#a5a5a6] hover:bg-white/[0.06] hover:text-[#f5f5f4]"
        >
          <HugeiconsIcon icon={prefs.mode === "dark" ? Sun03Icon : Moon02Icon} size={16} strokeWidth={1.75} />
        </button>
      </div>
      <div
        data-theme={prefs.theme}
        data-density={prefs.density}
        className={`${prefs.mode} flex items-center justify-center bg-background p-8 transition-colors duration-200 sm:p-12`}
        style={{ minHeight }}
      >
        {children}
      </div>
      {code && (
      <div className={`relative border-t border-[#2a2a2a] ${open ? "" : "max-h-[118px] overflow-hidden"}`}>
        {code}
        {!open && (
          <div className="absolute inset-0 flex items-end justify-center bg-linear-to-b from-transparent via-[#121212]/70 to-[#121212] pb-4">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1.5 text-sm font-medium text-[#f5f5f4] hover:bg-[#222]"
            >
              View Code
            </button>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
