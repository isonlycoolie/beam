import { readFile, writeFile } from "node:fs/promises";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import type { CompareDifference } from "../contracts/index.js";

export type VisualComparison = {
  score: number;
  width: number;
  height: number;
  differences: CompareDifference[];
};

export async function comparePngFiles(input: {
  expectedPath: string;
  actualPath: string;
  diffPath: string;
}): Promise<VisualComparison> {
  const expected = PNG.sync.read(await readFile(input.expectedPath));
  const actual = PNG.sync.read(await readFile(input.actualPath));
  const width = Math.min(expected.width, actual.width);
  const height = Math.min(expected.height, actual.height);
  const diff = new PNG({ width, height });
  const mismatchedPixels = pixelmatch(
    expected.data,
    actual.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 },
  );
  const totalPixels = width * height || 1;
  const score = Number((1 - mismatchedPixels / totalPixels).toFixed(4));

  await writeFile(input.diffPath, PNG.sync.write(diff));

  return {
    score,
    width,
    height,
    differences: createDifferences(
      expected,
      actual,
      mismatchedPixels,
      totalPixels,
    ),
  };
}

function createDifferences(
  expected: PNG,
  actual: PNG,
  mismatchedPixels: number,
  totalPixels: number,
): CompareDifference[] {
  const differences: CompareDifference[] = [];

  if (expected.width !== actual.width || expected.height !== actual.height) {
    differences.push({
      type: "dimensions",
      severity: "high",
      message: "Screenshot dimensions differ.",
      expected: `${expected.width}x${expected.height}`,
      actual: `${actual.width}x${actual.height}`,
    });
  }

  if (mismatchedPixels > 0) {
    differences.push({
      type: "pixels",
      severity: mismatchedPixels / totalPixels > 0.1 ? "high" : "medium",
      message: "Rendered pixels differ from Figma export.",
      expected: "0 mismatched pixels",
      actual: `${mismatchedPixels} mismatched pixels`,
    });
  }

  return differences;
}
