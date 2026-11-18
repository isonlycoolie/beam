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