"use client";

import { useEffect, useState } from "react";

/** The photo every glass preview sits on: glass needs something behind it to blur and bend. Unsplash License. */
export const GLASS_PHOTO = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=70&auto=format";

const KEY = "beam-surface";
const EVENT = "beam-surface";

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "glass";
  } catch {
    return false;
  }
}

/**
 * Normal or Glass, shared by every preview on the site. Glass sets data-surface="glass" on <html>, so menus and
 * dialogs that render in <body> turn to glass too, and the choice is remembered for the next page.
 */
export function useSurface(): [boolean, (glass: boolean) => void] {
  const [glass, setGlass] = useState(false);
  useEffect(() => {
    const sync = () => {
      const on = read();
      setGlass(on);
      if (on) document.documentElement.dataset.surface = "glass";
      else delete document.documentElement.dataset.surface;
    };
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  const set = (on: boolean) => {
    try {
      localStorage.setItem(KEY, on ? "glass" : "normal");
    } catch {
      // Storage blocked: the switch still works for this page.
      if (on) document.documentElement.dataset.surface = "glass";
      else delete document.documentElement.dataset.surface;
      setGlass(on);
      return;
    }
    window.dispatchEvent(new Event(EVENT));
  };
  return [glass, set];
}

/** A two-option segmented switch: Normal · Glass. */
export function SurfaceToggle({ glass, onChange }: { glass: boolean; onChange: (glass: boolean) => void }) {
  return (
    <div role="radiogroup" aria-label="Surface" className="inline-flex shrink-0 rounded-lg border border-fd-border p-0.5 text-[13px] font-medium">
      {[
        ["Normal", false],
        ["Glass", true],
      ].map(([label, value]) => (
        <button
          key={String(label)}
          type="button"
          role="radio"
          aria-checked={glass === value}
          onClick={() => onChange(value as boolean)}
          className={`rounded-md px-2.5 py-1 transition-colors ${glass === value ? "bg-fd-accent text-fd-foreground" : "text-fd-muted-foreground hover:text-fd-foreground"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
