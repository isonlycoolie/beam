"use client";

import { useEffect, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import "./glass.css";

/**
 * Beam Glass. Mount <GlassFilter /> once (for example in your root layout); every glass surface uses it.
 * Copied into your project by `beam add glass`: it is your code now.
 */
export function GlassFilter({ strength = 42 }: { strength?: number }) {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
      <filter id="beam-glass-distortion" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="7" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale={strength} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

/** Only Chromium can apply an SVG filter to the backdrop; elsewhere the frosted style stays. */
function useLiquid(): boolean {
  const [liquid, setLiquid] = useState(false);
  useEffect(() => {
    const chromium = typeof navigator !== "undefined" && /Chrome\//.test(navigator.userAgent) && !/Firefox\//.test(navigator.userAgent);
    setLiquid(chromium && CSS.supports("backdrop-filter", "url(#beam-glass-distortion)"));
  }, []);
  return liquid;
}

type Tone = { tone?: "light" | "dark" };
const classes = (liquid: boolean, tone: Tone["tone"], ...extra: Array<string | undefined>) =>
  ["beam-glass", liquid && "beam-glass--liquid", tone === "dark" && "beam-glass--dark", ...extra].filter(Boolean).join(" ");

export function GlassPanel({ tone, className, children, ...rest }: HTMLAttributes<HTMLDivElement> & Tone & { children?: ReactNode }) {
  const liquid = useLiquid();
  return (
    <div className={classes(liquid, tone, className)} {...rest}>
      {children}
    </div>
  );
}

export function GlassButton({ tone, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & Tone) {
  const liquid = useLiquid();
  return (
    <button type="button" className={classes(liquid, tone, "beam-glass-button", className)} {...rest}>
      {children}
    </button>
  );
}

/** A floating pill bar for navigation or toolbars. */
export function GlassBar({ tone, className, style, children, ...rest }: HTMLAttributes<HTMLElement> & Tone) {
  const liquid = useLiquid();
  return (
    <nav
      className={classes(liquid, tone, className)}
      style={{ ["--glass-radius" as string]: "999px", display: "flex", alignItems: "center", gap: 4, padding: 6, ...style }}
      {...rest}
    >
      {children}
    </nav>
  );
}
