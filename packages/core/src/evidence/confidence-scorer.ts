import type { BeamWarning, ImplementationBrief } from "../contracts/index.js";

export type ConfidenceInput = {
  brief: ImplementationBrief;
  warnings: BeamWarning[];
  includeImage: boolean;
  hasImage: boolean;
};

export function scoreConfidence(input: ConfidenceInput) {
  const nodeCount = Number(input.brief.frame["nodeCount"] ?? 0);
  const textItems = Array.isArray(input.brief.tokens["text"])
    ? input.brief.tokens["text"].length
    : 0;
  const colors = Array.isArray(input.brief.tokens["colors"])
    ? input.brief.tokens["colors"].length
    : 0;
  const assets = input.brief.assets.length;
  const warningPenalty = input.warnings.filter(
    (warning) => warning.severity !== "low",
  ).length;
  const score =
    0.25 +
    (nodeCount > 0 ? 0.18 : 0) +
    (textItems > 0 ? 0.14 : 0.06) +
    (colors > 0 ? 0.12 : 0.04) +
    (assets > 0 ? 0.12 : 0.04) +
    (input.includeImage && input.hasImage ? 0.18 : 0) -
    Math.min(warningPenalty * 0.08, 0.24);

  return clamp(score);
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, Number(value.toFixed(2))));
}
