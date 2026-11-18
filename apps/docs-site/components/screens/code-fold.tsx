"use client";

import { useState, type ReactNode } from "react";

/** The first few lines of a file fading out under "View Code", as on every component preview. */
export function CodeFold({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative ${open ? "" : "max-h-[200px] overflow-hidden"}`}>
      {children}
      {!open && (
        <div className="absolute inset-0 flex items-end justify-center bg-linear-to-b from-transparent via-fd-background/70 to-fd-background pb-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 text-sm font-medium text-fd-foreground shadow-sm hover:bg-fd-accent"
          >
            View Code
          </button>
        </div>
      )}
    </div>
  );
}
