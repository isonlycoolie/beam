import {
  designContextResponseSchema,
  type ContextMode,
  type DesignContextResponse,
  type ImplementationBrief,
  type BeamSnapshot,
  type BeamWarning,
  type EvidenceReview,
} from "../contracts/index.js";
import { reviewEvidence } from "../evidence/evidence-reviewer.js";
import type { ParsedFigmaUrl } from "../figma/url-parser.js";

export function createResponse(input: {
  source: ParsedFigmaUrl;
  mode: ContextMode;
  snapshot: BeamSnapshot;
  brief: ImplementationBrief;
  includeImage: boolean;
  warnings: BeamWarning[];
  estimatedTokens: number;
  evidence?: EvidenceReview;
}): DesignContextResponse {
  const image = input.includeImage
    ? {
        path: input.snapshot.paths.image ?? ".beam/cache/images/frame.png",
        scale: 2,
      }
    : undefined;
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
    ...(image ? { image } : {}),
    warnings: input.warnings,
    evidence:
      input.evidence ??
      reviewEvidence({
        brief: input.brief,
        warnings: input.warnings,
        includeImage: input.includeImage,
        hasImage: Boolean(image),
      }),
    estimatedTokens: input.estimatedTokens,
  });
}

export function withCacheHit(response: unknown): DesignContextResponse {
  const cached = response as Partial<DesignContextResponse>;
  const parsed = designContextResponseSchema.parse(
    cached.evidence
      ? cached
      : {
          ...cached,
          evidence:
            cached.brief && cached.warnings
              ? reviewEvidence({
                  brief: cached.brief,
                  warnings: cached.warnings,
                  includeImage: Boolean(cached.image),
                  hasImage: Boolean(cached.image),
                })
              : undefined,
        },
  );
  return {
    ...parsed,
    snapshot: {
      ...parsed.snapshot,
      fromCache: true,
    },
  };
}
