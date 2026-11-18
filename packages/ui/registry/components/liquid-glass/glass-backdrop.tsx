"use client";

/*
 * GlassBackdrop: the Tab Bar's liquid glass, carried by any surface (cards, menus, dialogs, buttons, the sidebar).
 * Put it first inside the surface. In Normal mode it renders nothing. When the page is in glass mode
 * (data-surface="glass" on <html> or <body>), it renders the backdrop the surface sits on: frosted, saturated and
 * bent along the rim by a refraction map drawn for the surface's own size and radius, as Liquid Glass does.
 * The surface's own translucent colour sits on top of it.
 */
import { useEffect, useId, useRef, useState } from "react";
import { bandWidth, displacementMap } from "./liquid-glass-map";
import { LiquidFilter } from "./liquid-filter";

// One observer for the whole page: every backdrop re-checks when glass mode is switched.
const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;
const glassOn = () => document.documentElement.dataset.surface === "glass" || document.body?.dataset.surface === "glass";
function watch(fn: () => void) {
  listeners.add(fn);
  if (!observer) {
    observer = new MutationObserver(() => listeners.forEach((f) => f()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-surface"] });
    if (document.body) observer.observe(document.body, { attributes: true, attributeFilter: ["data-surface"] });
  }
  return () => {
    listeners.delete(fn);
  };
}

/** True while the page is in glass mode. */
export function useGlassMode(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const check = () => setOn(glassOn());
    check();
    return watch(check);
  }, []);
  return on;
}

// Maps are drawn once per size: twenty menu items of one size share one map.
const maps = new Map<string, string>();
const num = (name: string, fallback: number) => {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
};

function Layer() {
  const id = `glass-${useId().replaceAll(":", "")}`;
  const ref = useRef<HTMLSpanElement>(null);
  const [shape, setShape] = useState<{ map: string; band: number } | null>(null);
  const [refracts, setRefracts] = useState(false);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    setRefracts(!navigator.userAgent.toLowerCase().includes("firefox"));
    let last = "";
    const draw = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const radius = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, width / 2, height / 2);
      const key = `${Math.round(width)}x${Math.round(height)}x${Math.round(radius)}`;
      if (key === last) return;
      last = key;
      let map = maps.get(key);
      if (!map) {
        map = displacementMap(width, height, radius);
        maps.set(key, map);
      }
      setShape({ map, band: bandWidth(width, height) });
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const warp = "blur(calc(var(--beam-glass-frost, 3px) * var(--glass-frost-scale, 4))) saturate(var(--beam-glass-saturate, 1.8)) brightness(1.05)";
  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="glass-backdrop"
      data-liquid-warp=""
      className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
      style={{ filter: shape && refracts ? `url(#${id})` : undefined, backdropFilter: warp, WebkitBackdropFilter: warp }}
    >
      {shape && refracts && <LiquidFilter id={id} map={shape.map} shift={shape.band * num("--beam-glass-bend", 1)} dispersion={num("--beam-glass-dispersion", 0.6)} />}
    </span>
  );
}

/** The liquid glass under a surface. Renders nothing outside glass mode. */
export function GlassBackdrop() {
  return useGlassMode() ? <Layer /> : null;
}
