import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { assetManifestSchema, type AssetManifest } from "../contracts/index.js";
import { createBeamPaths } from "../config/paths.js";
import { FigmaClient } from "../figma/figma-client.js";
import { parseFigmaUrl } from "../figma/url-parser.js";
import { loadFigmaCredentials } from "../auth/credential-store.js";
import {
  extractImageUrls,
  normalizeOutDir,
  safeName,
  writeAssetFile,
} from "./asset-export-helpers.js";

export type ExportDesignAssetsInput = {
  url: string;
  cwd: string;
  homeDir?: string;
  outDir?: string;
  scale?: 1 | 2 | 3 | 4;
  refresh?: boolean;
  figmaClient?: Pick<FigmaClient, "getImages">;
  fetch?: typeof fetch;
  nodeIds?: string[];
  snapshotId?: string;
  createdAt?: string;
};

export async function exportDesignAssets(
  input: ExportDesignAssetsInput,
): Promise<AssetManifest & { manifestPath: string }> {
  const source = parseFigmaUrl(input.url);
  const scale = input.scale ?? 2;
  const nodeIds = input.nodeIds ?? [source.nodeId ?? source.fileKey];
  const credentials = input.figmaClient
    ? undefined
    : await loadFigmaCredentials({ homeDir: input.homeDir });
  const figmaClient =
    input.figmaClient ??
    new FigmaClient({ accessToken: credentials?.accessToken ?? "" });
  const imageResponse = await figmaClient.getImages(source.fileKey, nodeIds, {
    format: "png",
    scale,
  });
  const imageUrls = extractImageUrls(imageResponse);
  const paths = createBeamPaths({ cwd: input.cwd });
  const outDir = input.outDir ?? ".beam/cache/assets";
  const absoluteOutDir = join(input.cwd, outDir);
  const fetchImpl = input.fetch ?? fetch;
  const snapshotId = input.snapshotId ?? `snapshot_${source.fileKey}`;
  const normalizedOutDir = normalizeOutDir(outDir);
  const assets = [];

  for (const nodeId of nodeIds) {
    const imageUrl = imageUrls[nodeId];
    if (!imageUrl) {
      continue;
    }

    const fileName = `${safeName(nodeId)}-${scale}x.png`;
    const relativePath = `${normalizedOutDir}/${fileName}`;
    const absolutePath = join(absoluteOutDir, fileName);
    const response = await fetchImpl(imageUrl);
    const bytes = new Uint8Array(await response.arrayBuffer());
    await writeAssetFile(absolutePath, bytes);

    assets.push({
      id: `asset_${safeName(nodeId)}`,
      nodeId,
      name: nodeId === source.nodeId ? "Frame" : nodeId,
      type: nodeId === source.nodeId ? "frame" : "raster",
      format: "png",
      scale,
      path: relativePath,
      sourceUrl: input.url,
    });
  }

  const manifest = assetManifestSchema.parse({
    schemaVersion: "1.0",
    snapshotId,
    createdAt: input.createdAt ?? new Date().toISOString(),
    assets,
  });
  const manifestPath = `${normalizedOutDir}/${snapshotId}.manifest.json`;
  const absoluteManifestPath = join(paths.cwd, manifestPath);

  await mkdir(dirname(absoluteManifestPath), { recursive: true });
  await writeFile(
    absoluteManifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  return { ...manifest, manifestPath };
}
