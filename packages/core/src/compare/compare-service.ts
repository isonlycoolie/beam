import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { compareResultSchema, type CompareResult } from "../contracts/index.js";
import { createBeamPaths } from "../config/paths.js";
import { exportDesignAssets } from "../assets/asset-exporter.js";
import { captureUrlScreenshot } from "./screenshot-capture.js";
import { comparePngFiles } from "./visual-comparator.js";

export type CompareDesignToUrlInput = {
  figmaUrl: string;
  targetUrl: string;
  cwd: string;
  threshold?: number;
  outDir?: string;
  refresh?: boolean;
};

export async function compareDesignToUrl(
  input: CompareDesignToUrlInput,
): Promise<CompareResult> {
  const threshold = input.threshold ?? 0.95;
  const compareId = `compare_${Date.now()}`;
  const paths = createBeamPaths({ cwd: input.cwd });
  const outDir = input.outDir ?? ".beam/cache/compare";
  const absoluteOutDir = join(paths.cwd, outDir);
  const targetImage = join(absoluteOutDir, `${compareId}-target.png`);
  const diffImage = join(absoluteOutDir, `${compareId}-diff.png`);
  await mkdir(absoluteOutDir, { recursive: true });

  const manifest = await exportDesignAssets({
    url: input.figmaUrl,
    cwd: input.cwd,
    refresh: input.refresh,
    outDir: ".beam/cache/images",
    snapshotId: compareId,
  });
  const figmaImage = join(paths.cwd, manifest.assets[0]?.path ?? "");
  await captureUrlScreenshot({ url: input.targetUrl, outputPath: targetImage });
  const comparison = await comparePngFiles({
    expectedPath: figmaImage,
    actualPath: targetImage,
    diffPath: diffImage,
  });
  const result = compareResultSchema.parse({
    schemaVersion: "1.0",
    id: compareId,
    figmaSnapshotId: manifest.snapshotId,
    targetUrl: input.targetUrl,
    createdAt: new Date().toISOString(),
    threshold,
    score: comparison.score,
    passed: comparison.score >= threshold,
    artifacts: { figmaImage, targetImage, diffImage },
    differences: comparison.differences,
  });

  await writeFile(
    join(absoluteOutDir, `${compareId}.json`),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  return result;
}
