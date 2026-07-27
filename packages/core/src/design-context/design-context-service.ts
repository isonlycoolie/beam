import { type DesignContextResponse } from "../contracts/index.js";
import { loadFigmaCredentials } from "../auth/credential-store.js";
import { CacheManager } from "../cache/cache-manager.js";
import { loadBeamConfig } from "../config/config-store.js";
import { FigmaClient } from "../figma/figma-client.js";
import { parseFigmaUrl } from "../figma/url-parser.js";
import { simplifyDesign } from "../simplify/design-simplifier.js";
import { SnapshotStore } from "../snapshots/snapshot-store.js";
import { planImplementationBrief } from "../tokens/token-planner.js";
import { extractDocument } from "./payload-extractor.js";
import { createResponse, withCacheHit } from "./response-builder.js";
import type { CreateDesignContextInput } from "./types.js";
export type { CreateDesignContextInput } from "./types.js";

export async function createDesignContext(
  input: CreateDesignContextInput,
): Promise<DesignContextResponse> {
  const mode = input.mode ?? "standard";
  const includeImage = input.includeImage ?? true;
  const includeAssets = input.includeAssets ?? true;
  const refresh = input.refresh ?? false;
  const source = parseFigmaUrl(input.url);
  const cache = new CacheManager({ cwd: input.cwd });
  const cacheInput = {
    endpoint: source.nodeId
      ? "GET /v1/files/:file_key/nodes"
      : "GET /v1/files/:file_key",
    fileKey: source.fileKey,
    ...(source.nodeId ? { nodeId: source.nodeId } : {}),
    mode,
    schemaVersion: "1.0" as const,
  };
  const cached = await cache.read({ ...cacheInput, refresh });

  if (cached.hit) {
    return withCacheHit(cached.value as DesignContextResponse);
  }

  const credentials = input.figmaClient
    ? undefined
    : await loadFigmaCredentials({ homeDir: input.homeDir });
  const { config } = await loadBeamConfig({
    cwd: input.cwd,
    homeDir: input.homeDir,
  });
  const figmaClient =
    input.figmaClient ??
    new FigmaClient({
      accessToken: credentials?.accessToken ?? "",
      apiBaseUrl: config.figma?.apiBaseUrl,
    });
  const rawPayload = source.nodeId
    ? await figmaClient.getFileNodes(source.fileKey, [source.nodeId])
    : await figmaClient.getFile(source.fileKey);
  const document = extractDocument(rawPayload, source.nodeId);
  const simplified = simplifyDesign({ document });
  const planned = planImplementationBrief(simplified.brief, mode);
  const brief = {
    ...planned.brief,
    frame: {
      ...planned.brief.frame,
      mode,
    },
  };
  const snapshot = await new SnapshotStore({ cwd: input.cwd }).create({
    source: {
      fileKey: source.fileKey,
      ...(source.nodeId ? { nodeId: source.nodeId } : {}),
      url: source.originalUrl,
    },
    mode,
    rawPayload,
    brief,
  });
  const response = createResponse({
    source,
    mode,
    snapshot,
    brief,
    includeImage,
    warnings: [...simplified.warnings, ...planned.warnings],
    estimatedTokens: planned.estimatedTokens,
  });

  await cache.write({
    ...cacheInput,
    value: response,
    createdAt: response.snapshot.createdAt,
  });

  if (!includeAssets) {
    return { ...response, brief: { ...response.brief, assets: [] } };
  }

  return response;
}
