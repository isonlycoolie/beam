/*
 * The refraction map behind Liquid Glass, after glisse's bezel model (MIT, see CREDITS.md): light bends only in
 * a band along the rim, as through the rounded edge of a thick pane, strongest at the very edge and gone a band's
 * width in; the middle stays clean. The band is 0.3 of the shorter side, at most 36px.
 *
 * Each pixel stores where it samples the backdrop from, as an x shift in red and a y shift in green and blue,
 * 0.5 meaning none. The SVG filter scales the shift to pixels (see liquid-glass.tsx).
 */

/** The bend band for a glass of this size: 0.3 of its shorter side, at most 36px. */
export const bandWidth = (width: number, height: number) => Math.min(36, 0.3 * Math.min(width, height));

/** Signed distance from a point (centred coordinates) to a rounded rectangle's edge; negative inside. */
function edgeDistance(x: number, y: number, halfW: number, halfH: number, radius: number): number {
  const qx = Math.abs(x) - halfW + radius;
  const qy = Math.abs(y) - halfH + radius;
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - radius;
}

/** Draws the map for a glass of this size and corner radius into a PNG data URL. */
export function displacementMap(width: number, height: number, radius: number): string {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext("2d");
  if (!context) return "";

  const halfW = w / 2;
  const halfH = h / 2;
  const corner = Math.max(0, Math.min(radius, halfW, halfH));
  const band = Math.max(1, bandWidth(w, h));
  const image = context.createImageData(w, h);
  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const x = col + 0.5 - halfW;
      const y = row + 0.5 - halfH;
      const depth = -edgeDistance(x, y, halfW, halfH, corner);
      let dx = 0;
      let dy = 0;
      if (depth >= 0 && depth < band) {
        // Strongest at the rim, easing to nothing a band's width in.
        const t = 1 - depth / band;
        const strength = t * t;
        // The inward normal, from the gradient of the distance field.
        const e = 0.5;
        const gx = edgeDistance(x + e, y, halfW, halfH, corner) - edgeDistance(x - e, y, halfW, halfH, corner);
        const gy = edgeDistance(x, y + e, halfW, halfH, corner) - edgeDistance(x, y - e, halfW, halfH, corner);
        const len = Math.hypot(gx, gy) || 1;
        dx = (-gx / len) * strength;
        dy = (-gy / len) * strength;
      }
      const p = (row * w + col) * 4;
      image.data[p] = Math.round((dx * 0.5 + 0.5) * 255);
      image.data[p + 1] = Math.round((dy * 0.5 + 0.5) * 255);
      image.data[p + 2] = Math.round((dy * 0.5 + 0.5) * 255);
      image.data[p + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL();
}
