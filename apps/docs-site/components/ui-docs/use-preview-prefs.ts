"use client";

import { useEffect, useState } from "react";

export const THEMES = ["beam", "ledger", "clinic", "studio"] as const;
type Theme = (typeof THEMES)[number];
type Mode = "light" | "dark";
type Density = "comfortable" | "compact";
type Prefs = { theme: Theme; mode: Mode; density: Density };

const KEY = "beam-ui-preview";
const DEFAULTS: Prefs = { theme: "beam", mode: "light", density: "comfortable" };
const listeners = new Set<(p: Prefs) => void>();

/** One choice for every preview on the page, remembered between visits. */
export function usePrefs(): [Prefs, (next: Partial<Prefs>) => void] {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as Prefs | null;
      if (saved) setPrefs({ ...DEFAULTS, ...saved });
    } catch {
      // Storage can be blocked; the defaults still work.
    }
    listeners.add(setPrefs);
    return () => void listeners.delete(setPrefs);
  }, []);
  const update = (next: Partial<Prefs>) => {
    const merged = { ...prefs, ...next };
    try {
      localStorage.setItem(KEY, JSON.stringify(merged));
    } catch {
      // Ignore: the choice still applies for this page view.
    }
    listeners.forEach((set) => set(merged));
  };
  return [prefs, update];
}
