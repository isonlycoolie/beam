"use client";

import { useState } from "react";
import { SurfaceToggle, useSurface } from "../ui-docs/surface-toggle";

const WIDTHS = { Desktop: "100%", Tablet: "820px", Phone: "390px" } as const;
type Width = keyof typeof WIDTHS;

/**
 * A screen live in a frame, at desktop, tablet or phone width. The controls sit above the frame, as on every
 * component preview: widths on the left, Normal · Glass and "open in a new tab" on the right.
 */
export function ScreenFrame({ id, height = 760 }: { id: string; height?: number }) {
  const [width, setWidth] = useState<Width>("Desktop");
  const src = `/preview/screens/${id}`;
  const [glass, setGlass] = useSurface();
  return (
    <div className="not-prose my-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div role="tablist" aria-label="Width" className="flex min-w-0 gap-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
          {(Object.keys(WIDTHS) as Width[]).map((w) => (
            <button
              key={w}
              type="button"
              role="tab"
              aria-selected={w === width}
              onClick={() => setWidth(w)}
              className={`-mb-px border-b-2 pb-1.5 text-[15px] font-medium transition-colors ${
                w === width ? "border-fd-foreground text-fd-foreground" : "border-transparent text-fd-muted-foreground hover:text-fd-foreground"
              }`}
            >
              {w}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <SurfaceToggle glass={glass} onChange={setGlass} />
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            aria-label="Open in a new tab"
            title="Open in a new tab"
            className="flex size-[30px] items-center justify-center rounded-lg border border-fd-border text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
            </svg>
          </a>
        </div>
      </div>
      <div className="flex justify-center overflow-hidden rounded-xl border border-fd-border bg-fd-muted/40">
        <iframe
          title={`${id} preview`}
          src={src}
          loading="lazy"
          className="block border-0 bg-fd-background transition-[width] duration-200"
          style={{ width: WIDTHS[width], height, borderInline: width === "Desktop" ? undefined : "1px solid var(--color-fd-border)" }}
        />
      </div>
    </div>
  );
}
