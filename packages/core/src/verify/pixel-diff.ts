import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import type { CapturedSection } from "./types.js";

export type SectionScore = { index: number; label: string; top: number; height: number; score: number };
export type PixelDiff = {
  score: number;
  width: number;
  height: number;
  /** Reference and target sizes differ when the build is taller, shorter or wider than the source. */
  size: { reference: [number, number]; target: [number, number] };
  sections: SectionScore[];
  diffPng: Buffer;
};

/** Places an image on a white canvas so both sides can be compared at the same size. */
function pad(image: PNG, width: number, height: number): PNG {
  if (image.width === width && image.height === height) return image;
  const canvas = new PNG({ width, height });
  canvas.data.fill(255);
  const rowBytes = Math.min(image.width, width) * 4;
  for (let y = 0; y < Math.min(image.height, height); y++)
    image.data.copy(canvas.data, y * width * 4, y * image.width * 4, y * image.width * 4 + rowBytes);
  return canvas;
}

/** Without page sections (a PNG reference), score the page in 600 px bands. */
export function bandSections(height: number, band = 600): CapturedSection[] {
  const sections: CapturedSection[] = [];
  for (let top = 0, index = 0; top < height; top += band, index++)
    sections.push({ index, label: `band ${index + 1}`, top, height: Math.min(band, height - top) });
  return sections;
}

export function diffPngs(input: { reference: Buffer; target: Buffer; sections?: CapturedSection[] }): PixelDiff {
  const reference = PNG.sync.read(input.reference);
  const target = PNG.sync.read(input.target);
  const width = Math.max(reference.width, target.width);
  const height = Math.max(reference.height, target.height);
  const a = pad(reference, width, height);
  const b = pad(target, width, height);
  const mask = new PNG({ width, height });
  // diffMask leaves unchanged pixels transparent, so every opaque pixel in the mask is a real difference.
  const mismatched = pixelmatch(a.data, b.data, mask.data, width, height, { threshold: 0.1, diffMask: true });

  const rows = new Uint32Array(height);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) if (mask.data[(y * width + x) * 4 + 3] !== 0) rows[y]! += 1;

  const sections = (input.sections?.length ? input.sections : bandSections(height)).map((section) => {
    const end = Math.min(height, section.top + section.height);
    let bad = 0;
    for (let y = Math.max(0, section.top); y < end; y++) bad += rows[y]!;
    const total = Math.max(1, (end - Math.max(0, section.top)) * width);
    return { ...section, score: Number((1 - bad / total).toFixed(4)) };
  });

  return {
    score: Number((1 - mismatched / Math.max(1, width * height)).toFixed(4)),
    width,
    height,
    size: { reference: [reference.width, reference.height], target: [target.width, target.height] },
    sections,
    diffPng: PNG.sync.write(mask),
  };
}
