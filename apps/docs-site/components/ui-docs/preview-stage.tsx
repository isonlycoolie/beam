"use client";

import { useState, type ReactNode } from "react";
import { GLASS_PHOTO, SurfaceToggle, useSurface } from "./surface-toggle";

export type PreviewPanel = { id: string; label: string; preview: ReactNode; code?: ReactNode };

/**
 * A preview as the shadcn docs show it: a quiet bordered card in the page's own colour, the component centred,
 * and its code fading out under "View Code". With more than one panel, an underline tab row switches the style.
 * The stage follows the site's light or dark mode; it never has its own switch.
 */
export function PreviewStage({ panels, tabs = false, minHeight = 350 }: { panels: PreviewPanel[]; tabs?: boolean; minHeight?: number }) {
  const [active, setActive] = useState(panels[0]?.id);
  const [open, setOpen] = useState(false);
  const current = panels.find((p) => p.id === active) ?? panels[0];
  const [glass, setGlass] = useSurface();
  return (
    <div className="not-prose my-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        {tabs && panels.length > 1 ? (
          <div role="tablist" aria-label="Style" className="flex min-w-0 gap-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
            {panels.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={p.id === current?.id}
                onClick={() => setActive(p.id)}
                className={`-mb-px border-b-2 pb-1.5 text-[15px] font-medium transition-colors ${
                  p.id === current?.id ? "border-fd-foreground text-fd-foreground" : "border-transparent text-fd-muted-foreground hover:text-fd-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <SurfaceToggle glass={glass} onChange={setGlass} />
      </div>
      <div className="overflow-hidden rounded-xl border border-fd-border">
        {panels.map((p) => (
          <div key={p.id} hidden={p.id !== current?.id} role={tabs ? "tabpanel" : undefined}>
            <div
              data-theme="default"
              className="flex items-center justify-center bg-cover bg-center p-8 sm:p-10"
              style={{ minHeight, backgroundImage: glass ? `url(${GLASS_PHOTO})` : undefined }}
            >
              {p.preview}
            </div>
            {p.code && (
              <div className={`relative border-t border-fd-border bg-fd-card/40 ${open ? "" : "max-h-[116px] overflow-hidden"}`}>
                {p.code}
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
