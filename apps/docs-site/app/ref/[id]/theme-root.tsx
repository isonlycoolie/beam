"use client";

import { useEffect } from "react";

/**
 * Puts the harness palette and mode on <body>, so portalled content (menus, dialogs) matches the rebuild.
 * The mode goes on body as .light or .dark: palettes honour both there, whatever <html> says.
 */
export function ThemeRoot({ palette, mode }: { palette: string; mode: string }) {
  useEffect(() => {
    const body = document.body;
    const was = body.dataset.theme;
    body.dataset.theme = palette;
    body.classList.add(mode);
    return () => {
      body.dataset.theme = was ?? "default";
      body.classList.remove(mode);
    };
  }, [palette, mode]);
  return null;
}
