import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { PNG } from "pngjs";
import type { CapturedElement, CapturedSection } from "./types.js";

/**
 * What a build is checked against:
 * - web: a live or file URL, captured fresh at every breakpoint
 * - png: a single image (pixels only, at the image's width)
 * - figma: a Beam Figma import folder (figma:<dir>): its render for pixels, its text layers for the drift check
 */
export type Reference =
  | { kind: "web"; url: string }
  | { kind: "png"; png: Buffer; width: number }
  | { kind: "figma"; png: Buffer; width: number; elements: CapturedElement[]; sections: CapturedSection[] };

export async function loadReference(value: string, cwd: string): Promise<Reference> {
  if (/^https?:\/\//i.test(value) || value.startsWith("file:")) return { kind: "web", url: value };
  if (value.startsWith("figma:")) {
    const dir = resolve(cwd, value.slice("figma:".length));
    const spec = JSON.parse(await readFile(join(dir, "spec.json"), "utf8")) as {
      breakpoints: Array<{ width: number; elements: CapturedElement[]; sections: CapturedSection[] }>;
    };
    const frame = spec.breakpoints[0]!;
    // Only text layers can be paired with page elements reliably; shapes are judged by pixels.
    const elements = frame.elements.filter((el) => el.text);
    return { kind: "figma", png: await readFile(join(dir, "frame.png")), width: frame.width, elements, sections: frame.sections };
  }
  const png = await readFile(resolve(cwd, value));
  return { kind: "png", png, width: PNG.sync.read(png).width };
}
