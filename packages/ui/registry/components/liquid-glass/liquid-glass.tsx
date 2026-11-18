"use client";

/*
 * Liquid Glass: Apple's material on the web. The backdrop is blurred, saturated and bent at the edges by a
 * displacement map, with chromatic aberration on the rim, a highlight that follows the pointer, and an elastic
 * stretch toward it. Ported from liquid-glass-react (MIT) as one Beam component with no runtime dependency.
 *
 * The bending is a Chromium feature (Chrome, Edge, Android). Safari and Firefox show the frosted glass, rim and
 * motion without the bend. prefers-reduced-transparency gives a solid surface; prefers-reduced-motion stops the
 * stretch.
 */
import { type CSSProperties, type ComponentProps, useEffect, useId, useRef, useState } from "react";
import { cn } from "../../../lib/cn";
import { displacementMap } from "./liquid-glass-map";

type LiquidFilterProps = { id: string; map: string; displacement: number; aberration: number };

/** The SVG filter: displace each colour channel a little differently at the edges, keep the centre clean. */
function LiquidFilter({ id, map, displacement, aberration }: LiquidFilterProps) {
  const channel = (offset: number, matrix: string, result: string) => (
    <>
      <feDisplacementMap in="SourceGraphic" in2="MAP" scale={displacement * (1 - aberration * offset)} xChannelSelector="R" yChannelSelector="B" result={`${result}_D`} />
      <feColorMatrix in={`${result}_D`} type="matrix" values={matrix} result={result} />
    </>
  );
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute size-0">
      <defs>
        <filter id={id} x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
          <feImage x="0" y="0" width="100%" height="100%" result="MAP" href={map} preserveAspectRatio="none" />
          <feColorMatrix in="MAP" type="matrix" values="0.3 0.3 0.3 0 0 0.3 0.3 0.3 0 0 0.3 0.3 0.3 0 0 0 0 0 1 0" result="EDGE_INTENSITY" />
          <feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
            <feFuncA type="discrete" tableValues={`0 ${aberration * 0.05} 1`} />
          </feComponentTransfer>
          <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER" />
          {channel(0, "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0", "RED")}
          {channel(0.05, "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0", "GREEN")}
          {channel(0.1, "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0", "BLUE")}
          <feBlend in="GREEN" in2="BLUE" mode="screen" result="GB" />
          <feBlend in="RED" in2="GB" mode="screen" result="RGB" />
          <feGaussianBlur in="RGB" stdDeviation={Math.max(0.1, 0.5 - aberration * 0.1)} result="SOFT" />
          <feComposite in="SOFT" in2="EDGE_MASK" operator="in" result="EDGE" />
          <feComponentTransfer in="EDGE_MASK" result="INVERTED">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feComposite in="CENTER" in2="INVERTED" operator="in" result="CLEAN" />
          <feComposite in="EDGE" in2="CLEAN" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export type LiquidGlassProps = ComponentProps<"div"> & {
  /** How far the edges bend the backdrop, in px. */
  displacement?: number;
  /** Frosting: 0 is clear glass. */
  blur?: number;
  saturation?: number;
  /** Colour fringing on the rim. */
  aberration?: number;
  /** How much the glass stretches toward the pointer: 0 turns it off. */
  elasticity?: number;
  /** Corner radius in px. 999 is a pill. */
  radius?: number;
  /** Over light content: a darker rim and shadow so the edge still reads. */
  overLight?: boolean;
};

/** A liquid glass surface. Put content inside; it stays sharp above the bent backdrop. */
export function LiquidGlass({
  displacement = 64,
  blur = 0.1,
  saturation = 140,
  aberration = 2,
  elasticity = 0.15,
  radius = 999,
  overLight = false,
  className,
  style,
  children,
  ...props
}: LiquidGlassProps) {
  const id = `liquid-${useId().replaceAll(":", "")}`;
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState("");
  const [firefox, setFirefox] = useState(false);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  // The map is drawn for the glass's real size, again whenever it resizes.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setFirefox(navigator.userAgent.toLowerCase().includes("firefox"));
    let last = "";
    const draw = () => {
      const { width, height } = el.getBoundingClientRect();
      const key = `${Math.round(width)}x${Math.round(height)}`;
      if (key === last || !width || !height) return;
      last = key;
      setMap(displacementMap(width, height));
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pointer position relative to the centre, in % of the size: drives the highlight angle and the stretch.
  useEffect(() => {
    const el = ref.current;
    if (!el || !elasticity || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      setPointer({ x: ((e.clientX - (r.left + r.width / 2)) / r.width) * 100, y: ((e.clientY - (r.top + r.height / 2)) / r.height) * 100 });
    };
    const leave = () => setPointer(null);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [elasticity]);

  const ox = pointer?.x ?? 0;
  const oy = pointer?.y ?? 0;
  // liquid-glass-react's stretch: longer along the pointer's direction, a little narrower across it.
  const dist = Math.hypot(ox, oy);
  const k = pointer && dist ? Math.min(dist / 100, 1) * elasticity : 0;
  const nx = dist ? Math.abs(ox) / dist : 0;
  const ny = dist ? Math.abs(oy) / dist : 0;
  const transform = k
    ? `translate(${ox * elasticity * 0.1}px, ${oy * elasticity * 0.1}px) scaleX(${Math.max(0.8, 1 + nx * k * 0.3 - ny * k * 0.15)}) scaleY(${Math.max(0.8, 1 + ny * k * 0.3 - nx * k * 0.15)})`
    : undefined;
  const rim = (strength: number): CSSProperties => ({
    background: `linear-gradient(${135 + ox * 1.2}deg, rgb(255 255 255 / 0) 0%, rgb(255 255 255 / ${0.12 * strength + Math.abs(ox) * 0.008}) ${Math.max(10, 33 + oy * 0.3)}%, rgb(255 255 255 / ${0.4 * strength + Math.abs(ox) * 0.012}) ${Math.min(90, 66 + oy * 0.4)}%, rgb(255 255 255 / 0) 100%)`,
  });

  return (
    <div
      ref={ref}
      data-slot="liquid-glass"
      className={cn("relative isolate overflow-hidden transition-transform duration-200 ease-out", className)}
      style={{ borderRadius: radius, transform, boxShadow: overLight ? "0 16px 70px rgb(0 0 0 / 0.45)" : "0 12px 40px rgb(0 0 0 / 0.25)", ...style }}
      {...props}
    >
      {map && <LiquidFilter id={id} map={map} displacement={overLight ? displacement * 0.5 : displacement} aberration={aberration} />}
      {/* The bent backdrop. */}
      <span
        aria-hidden="true"
        data-liquid-warp=""
        className="absolute inset-0 -z-10 rounded-[inherit]"
        style={{
          filter: map && !firefox ? `url(#${id})` : undefined,
          backdropFilter: `blur(${(overLight ? 12 : 4) + blur * 32}px) saturate(${saturation}%)`,
          WebkitBackdropFilter: `blur(${(overLight ? 12 : 4) + blur * 32}px) saturate(${saturation}%)`,
        }}
      />
      {overLight && <span aria-hidden="true" className="absolute inset-0 -z-10 rounded-[inherit] bg-black/20" />}
      {children}
      {/* Two rims, as liquid-glass-react draws them: one screened, one overlaid, both catching the light. */}
      <span aria-hidden="true" className="liquid-glass-rim pointer-events-none absolute inset-0 rounded-[inherit] opacity-20 mix-blend-screen" style={rim(1)} />
      <span aria-hidden="true" className="liquid-glass-rim pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay" style={rim(2.2)} />
    </div>
  );
}
