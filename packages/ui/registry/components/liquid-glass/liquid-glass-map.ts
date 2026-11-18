/*
 * The refraction map behind Liquid Glass: for every pixel, how far the backdrop shifts, strongest at the rounded
 * edges and zero in the middle, so the glass bends light like a thick lens. Ported from liquid-glass-react (MIT),
 * which adapted it from shuding/liquid-glass (MIT). See CREDITS.md.
 */
type Vec2 = { x: number; y: number };

function smoothStep(a: number, b: number, t: number): number {
  const v = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return v * v * (3 - 2 * v);
}

function roundedRectSDF(x: number, y: number, width: number, height: number, radius: number): number {
  const qx = Math.abs(x) - width + radius;
  const qy = Math.abs(y) - height + radius;
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - radius;
}

/** Where each point of the glass samples the backdrop from, in 0..1 coordinates. */
function liquidGlass(uv: Vec2): Vec2 {
  const ix = uv.x - 0.5;
  const iy = uv.y - 0.5;
  const displacement = smoothStep(0.8, 0, roundedRectSDF(ix, iy, 0.3, 0.2, 0.6) - 0.15);
  const scaled = smoothStep(0, 1, displacement);
  return { x: ix * scaled + 0.5, y: iy * scaled + 0.5 };
}

/** Draws the map for a glass of this size into a PNG data URL (red = x shift, green and blue = y shift). */
export function displacementMap(width: number, height: number): string {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext("2d");
  if (!context) return "";

  let maxScale = 0;
  const raw = new Float32Array(w * h * 2);
  for (let y = 0, i = 0; y < h; y++) {
    for (let x = 0; x < w; x++, i += 2) {
      const pos = liquidGlass({ x: x / w, y: y / h });
      const dx = pos.x * w - x;
      const dy = pos.y * h - y;
      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
      raw[i] = dx;
      raw[i + 1] = dy;
    }
  }
  maxScale = Math.max(maxScale, 1);

  const image = context.createImageData(w, h);
  for (let y = 0, i = 0; y < h; y++) {
    for (let x = 0; x < w; x++, i += 2) {
      // Fade the shift out over the last 2px so the map never has a hard edge.
      const edge = Math.min(1, Math.min(x, y, w - x - 1, h - y - 1) / 2);
      const r = ((raw[i] ?? 0) * edge) / maxScale + 0.5;
      const g = ((raw[i + 1] ?? 0) * edge) / maxScale + 0.5;
      const p = (y * w + x) * 4;
      image.data[p] = Math.max(0, Math.min(255, r * 255));
      image.data[p + 1] = Math.max(0, Math.min(255, g * 255));
      image.data[p + 2] = Math.max(0, Math.min(255, g * 255));
      image.data[p + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL();
}
