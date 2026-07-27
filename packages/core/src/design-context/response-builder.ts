import {
  designContextResponseSchema,
  type ContextMode,
  type DesignContextResponse,
  type ImplementationBrief,
  type BeamSnapshot,
  type BeamWarning,
} from "../contracts/index.js";
import type { ParsedFigmaUrl } from "../figma/url-parser.js";

export function createResponse(input: {
  source: ParsedFigmaUrl;
  mode: ContextMode;
  snapshot: BeamSnapshot;
  brief: ImplementationBrief;
  includeImage: boolean;
  warnings: BeamWarning[];
  estimatedTokens: number;
}): DesignContextResponse {
  return designContextResponseSchema.parse({
    schemaVersion: "1.0",
    source: {
      fileKey: input.source.fileKey,
      ...(input.source.nodeId ? { nodeId: input.source.nodeId } : {}),
      url: input.source.originalUrl,
    },
    snapshot: {
      id: input.snapshot.id,
      createdAt: input.snapshot.createdAt,
      beamVersion: input.snapshot.beamVersion,
      fromCache: false,
    },
    brief: input.brief,
    ...(input.includeImage
      ? {
          image: {
            path: input.snapshot.paths.image ?? ".beam/cache/images/frame.png",
            scale: 2,
          },
        }
      : {}),
    warnings: input.warnings,
    estimatedTokens: input.estimatedTokens,
  });
}

export function withCacheHit(
  response: DesignContextResponse,
): DesignContextResponse {
  const parsed = designContextResponseSchema.parse(response);
  return {
    ...parsed,
    snapshot: {
      ...parsed.snapshot,
      fromCache: true,
    },
  };
}
