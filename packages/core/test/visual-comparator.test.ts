import { mkdtemp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { PNG } from "pngjs";
import { describe, expect, it } from "vitest";
import { comparePngFiles } from "../src/compare/visual-comparator.js";

describe("comparePngFiles", () => {
  it("scores identical images as a perfect match", async () => {
    const dir = await mkdtemp(join(tmpdir(), "beam-compare-"));
    const expected = join(dir, "expected.png");
    const actual = join(dir, "actual.png");
    const diff = join(dir, "diff.png");

    await writePng(expected, [255, 255, 255, 255]);
    await writePng(actual, [255, 255, 255, 255]);

    const result = await comparePngFiles({
      expectedPath: expected,
      actualPath: actual,
      diffPath: diff,
    });

    expect(result.score).toBe(1);
    expect(result.differences).toEqual([]);
  });
});

async function writePng(path: string, rgba: [number, number, number, number]) {
  const png = new PNG({ width: 2, height: 2 });

  for (let index = 0; index < png.data.length; index += 4) {
    png.data.set(rgba, index);
  }

  await writeFile(path, PNG.sync.write(png));
}
