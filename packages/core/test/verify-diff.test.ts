import { PNG } from "pngjs";
import { describe, expect, it } from "vitest";
import { bandSections, diffElements, diffPngs, type CapturedElement } from "../src/index.js";

function png(width: number, height: number, paint?: (x: number, y: number) => [number, number, number]): Buffer {
  const image = new PNG({ width, height });
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const [r, g, b] = paint?.(x, y) ?? [255, 255, 255];
      image.data.set([r, g, b, 255], (y * width + x) * 4);
    }
  return PNG.sync.write(image);
}

const el = (path: string, text: string, box: Partial<CapturedElement["box"]>, style: Partial<CapturedElement["style"]> = {}): CapturedElement => ({
  path,
  tag: path.split(">").at(-1)!.split(":")[0]!,
  text,
  box: { x: 0, y: 0, width: 100, height: 20, ...box },
  style: { color: "rgb(0, 0, 0)", fontSize: "16px", fontFamily: '"Inter", sans-serif', ...style } as CapturedElement["style"],
});

describe("verify pixel diff", () => {
  it("scores identical pages as 1 and isolates the section that changed", () => {
    const same = png(40, 100);
    expect(diffPngs({ reference: same, target: same }).score).toBe(1);

    const changed = png(40, 100, (_x, y) => (y >= 50 ? [0, 0, 0] : [255, 255, 255]));
    const result = diffPngs({
      reference: same,
      target: changed,
      sections: [
        { index: 0, label: "header", top: 0, height: 50 },
        { index: 1, label: "hero", top: 50, height: 50 },
      ],
    });
    expect(result.sections.map((s) => s.score)).toEqual([1, 0]);
    expect(result.score).toBe(0.5);
  });

  it("counts a shorter build as a difference instead of ignoring the missing part", () => {
    const result = diffPngs({ reference: png(10, 100, () => [0, 0, 0]), target: png(10, 50, () => [0, 0, 0]) });
    expect(result.size).toEqual({ reference: [10, 100], target: [10, 50] });
    expect(result.score).toBe(0.5);
  });

  it("splits pages without sections into 600px bands", () => {
    expect(bandSections(1300).map((s) => s.height)).toEqual([600, 600, 100]);
  });
});

describe("verify element diff", () => {
  it("reports exact expected and actual values, ignoring font fallbacks", () => {
    const reference = [el("body>main>h1", "Hello", { y: 100 }, { fontSize: "64px" })];
    const target = [el("body>main>h1", "Hello", { y: 100.5 }, { fontSize: "56px", fontFamily: "Inter, Arial" })];
    const diff = diffElements(reference, target);
    expect(diff.deltas).toEqual([
      expect.objectContaining({ property: "fontSize", expected: "64px", actual: "56px", severity: "high" }),
    ]);
  });

  it("pairs moved elements by text and lists what the build is missing", () => {
    const reference = [el("body>div>p", "Price", { x: 10 }), el("body>footer>a", "Contact", {})];
    const target = [el("body>section>div>p", "Price", { x: 30 })];
    const diff = diffElements(reference, target);
    expect(diff.matched).toBe(1);
    expect(diff.deltas[0]).toMatchObject({ property: "x", expected: "10px", actual: "30px", severity: "high" });
    expect(diff.missing).toEqual([{ path: "body>footer>a", tag: "a", text: "Contact" }]);
  });
});
