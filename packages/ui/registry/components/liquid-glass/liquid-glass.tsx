"use client";

/*
 * Liquid Glass: Apple's material on the web, tuned with the values glisse (MIT) measured from iOS 26.
 *   Bend        light bends in a band along the rim, strongest at the edge; the middle stays clean.
 *   Dispersion  red bends a little further than blue at the edge (0.6: 12%).
 *   Frost       a thin blur and saturation behind the glass (3px, 1.5).
 *   Rim         a 1.22px line of light, from the top left and its reflection, over a 0.5px edge.
 * Each is a prop or a CSS variable (--beam-glass-bend, -dispersion, -frost, -rim), so a page can tune them all.
 * Pressed, the glass grows and springs back. Ported from liquid-glass-react (MIT); see CREDITS.md.
 *
 * The bending is a Chromium feature (Chrome, Edge, Android). Safari and Firefox show frost and rim without it.
 */
import { type ComponentProps, type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { cn } from "../../../lib/cn";
import { usePress } from "../../../lib/use-press";
import { bandWidth, displacementMap } from "./liquid-glass-map";

/** The SVG filter: shift each colour channel by the map, red a little further than blue. */
function LiquidFilter({ id, map, shift, dispersion }: { id: string; map: string; shift: number; dispersion: number }) {
  const scale = 2 * shift;
  const split = dispersion * 0.1;
  const channel = (k: number, matrix: string, result: string) => (
    <>
      <feDisplacementMap in="SourceGraphic" in2="MAP" scale={scale * k} xChannelSelector="R" yChannelSelector="G" result={`${result}_D`} />
      <feColorMatrix in={`${result}_D`} type="matrix" values={matrix} result={result} />
    </>
  );
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute size-0">
      <defs>
        <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage x="0" y="0" width="100%" height="100%" result="MAP" href={map} preserveAspectRatio="none" />
          {channel(1 + split, "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0", "RED")}
          {channel(1, "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0", "GREEN")}
          {channel(1 - split, "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0", "BLUE")}
          <feBlend in="RED" in2="GREEN" mode="screen" result="RG" />
          <feBlend in="RG" in2="BLUE" mode="screen" />
        </filter>
      </defs>
    </svg>
  );
}

export type LiquidGlassProps = ComponentProps<"div"> & {
  /** How far the rim bends the backdrop, as a share of the bend band (1). */
  bend?: number;
  /** Colour split at the rim: 0.6 bends red 12% further than blue. */
  dispersion?: number;
  /** Blur behind the glass, in px (3). */
  frost?: number;
  /** Brightness of the rim light, 0 to 1 (0.3 light, 0.13 dark). */
  rim?: number;
  /** Corner radius in px. 999 is a pill. */
  radius?: number;
  /** Grow and spring back when pressed. */
  pressable?: boolean;
};

const num = (el: Element, name: string, fallback: number) => {
  const v = parseFloat(getComputedStyle(el).getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
};

/** A liquid glass surface. Put content inside; it stays sharp above the bent backdrop. */
export function LiquidGlass({ bend, dispersion, frost, rim, radius = 999, pressable = false, className, style, children, ...props }: LiquidGlassProps) {
  const id = `liquid-${useId().replaceAll(":", "")}`;
  const ref = useRef<HTMLDivElement>(null);
  const [shape, setShape] = useState<{ map: string; band: number } | null>(null);
  const [vars, setVars] = useState({ bend: 1, dispersion: 0.6 });
  const [refracts, setRefracts] = useState(false);
  usePress(ref, pressable);

  // The map is drawn for the glass's real size and radius, again whenever it resizes.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // As liquid-glass-react: Firefox draws the filtered backdrop wrongly, so it keeps frost and rim only.
    setRefracts(!navigator.userAgent.toLowerCase().includes("firefox"));
    setVars({ bend: num(el, "--beam-glass-bend", 1), dispersion: num(el, "--beam-glass-dispersion", 0.6) });
    let last = "";
    const draw = () => {
      const { width, height } = el.getBoundingClientRect();
      const r = Math.min(radius, width / 2, height / 2);
      const key = `${Math.round(width)}x${Math.round(height)}x${Math.round(r)}`;
      if (key === last || !width || !height) return;
      last = key;
      setShape({ map: displacementMap(width, height, r), band: bandWidth(width, height) });
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(el);
    return () => observer.disconnect();
  }, [radius]);

  const b = bend ?? vars.bend;
  const d = dispersion ?? vars.dispersion;
  const frostPx = frost === undefined ? "var(--beam-glass-frost, 3px)" : `${frost}px`;
  const warp = `blur(${frostPx}) saturate(var(--beam-glass-saturate, 1.5))`;
  const css = { borderRadius: radius, ...(rim === undefined ? {} : { "--beam-glass-rim": rim }), ...style } as CSSProperties;

  return (
    <div ref={ref} data-slot="liquid-glass" className={cn("beam-liquid relative isolate overflow-hidden", className)} style={css} {...props}>
      {shape && refracts && <LiquidFilter id={id} map={shape.map} shift={shape.band * b} dispersion={d} />}
      {/* The bent, frosted backdrop. */}
      <span
        aria-hidden="true"
        data-liquid-warp=""
        className="absolute inset-0 -z-10 rounded-[inherit]"
        style={{ filter: shape && refracts ? `url(#${id})` : undefined, backdropFilter: warp, WebkitBackdropFilter: warp }}
      />
      {children}
    </div>
  );
}
