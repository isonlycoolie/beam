import type {
  BeamWarning,
  BuildReadiness,
  EvidenceReview,
  ImplementationBrief,
} from "../contracts/index.js";
import { planClarifications } from "./clarification-planner.js";
import { scoreConfidence } from "./confidence-scorer.js";

export function reviewEvidence(input: {
  brief: ImplementationBrief;
  warnings: BeamWarning[];
  includeImage: boolean;
  hasImage: boolean;
  blocked?: BuildReadiness;
}): EvidenceReview {
  const score = scoreConfidence(input);
  const clarificationRequests = planClarifications(input);
  const blockingRequest = clarificationRequests.some(
    (request) => request.severity === "high" && !request.canProceedWithoutIt,
  );
  const buildReadiness =
    input.blocked ??
    (score >= 0.75 && !blockingRequest ? "ready" : "needs-user-evidence");

  return {
    summary: [
      known(
        "Frame",
        "figma-node-tree",
        "Frame metadata came from Figma nodes.",
      ),
      known(
        "Layout",
        "figma-node-tree",
        "Layout was inferred from node structure.",
      ),
      statusFor(input.hasImage, "Rendered image", "figma-rendered-image"),
      statusFor(input.brief.assets.length > 0, "Assets", "figma-assets"),
    ],
    confidence: {
      score,
      level: buildReadiness,
      reasons: confidenceReasons(input, score),
    },
    buildReadiness,
    clarificationRequests,
  };
}

function known(field: string, source: "figma-node-tree", message: string) {
  return { field, status: "known" as const, source, message };
}

function statusFor(
  available: boolean,
  field: string,
  source: "figma-rendered-image" | "figma-assets",
) {
  return {
    field,
    status: available ? ("known" as const) : ("missing" as const),
    source,
    message: available
      ? `${field} evidence is available.`
      : `${field} evidence is missing.`,
  };
}

function confidenceReasons(
  input: { warnings: BeamWarning[]; hasImage: boolean },
  score: number,
): string[] {
  const reasons = [`Confidence score is ${score}.`];
  if (input.hasImage) reasons.push("Rendered image evidence is available.");
  if (input.warnings.length > 0) reasons.push("Warnings reduce confidence.");
  return reasons;
}
