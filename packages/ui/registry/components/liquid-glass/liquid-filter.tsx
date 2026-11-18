/* The refraction filter Liquid Glass, the Tab Bar and GlassBackdrop share: each colour channel is shifted by the
   map, red a little further than blue (dispersion). Ported from liquid-glass-react (MIT); see CREDITS.md. */
export function LiquidFilter({ id, map, shift, dispersion }: { id: string; map: string; shift: number; dispersion: number }) {
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

