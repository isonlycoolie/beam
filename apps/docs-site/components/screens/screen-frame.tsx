"use client";

import { useState } from "react";
import { SurfaceToggle, useSurface } from "../ui-docs/surface-toggle";

const WIDTHS = { Desktop: "100%", Tablet: "820px", Phone: "390px" } as const;
type Width = keyof typeof WIDTHS;

/** A screen live in a frame, at desktop, tablet or phone width, with a link to open it on its own. */
export function ScreenFrame({ id, height = 760 }: { id: string; height?: number }) {
  const [width, setWidth] = useState<Width>("Desktop");
  const src = `/preview/screens/${id}`;
  const [glass, setGlass] = useSurface();
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border">
      <div className="flex h-11 items-center gap-5 border-b border-fd-border px-4">
        {(Object.keys(WIDTHS) as Width[]).map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setWidth(w)}
            aria-pressed={w === width}
            className={`relative h-full text-[13px] font-medium transition-colors ${
              w === width ? "text-fd-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-fd-foreground" : "text-fd-muted-foreground hover:text-fd-foreground"
            }`}
          >
            {w}
          </button>
        ))}
        <span className="ms-auto">
          <SurfaceToggle glass={glass} onChange={setGlass} />
        </span>
        <a href={src} target="_blank" rel="noreferrer" className="max-sm:hidden text-[13px] font-medium text-fd-muted-foreground hover:text-fd-foreground">
          Open in a new tab
        </a>
      </div>
      <div className="flex justify-center bg-fd-muted/40">
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
