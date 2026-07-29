import type {
  BeamWarning,
  ClarificationRequest,
  ImplementationBrief,
} from "../contracts/index.js";

export function planClarifications(input: {
  brief: ImplementationBrief;
  warnings: BeamWarning[];
  hasImage: boolean;
}): ClarificationRequest[] {
  const requests: ClarificationRequest[] = [];

  if (input.brief.assets.length === 0) {
    requests.push({
      kind: "user-asset-request",
      severity: "medium",
      message: "No source assets were available from the current evidence.",
      requestedEvidence: "Provide any required logo, hero, or image assets.",
      acceptedInputs: ["png", "jpg", "webp", "svg"],
      canProceedWithoutIt: true,
    });
  }

  if (!input.hasImage) {
    requests.push({
      kind: "user-screenshot-request",
      severity: "medium",
      message: "No rendered frame image is attached to this context.",
      requestedEvidence: "Provide a screenshot or export of the target frame.",
      acceptedInputs: ["png", "jpg", "webp"],
      canProceedWithoutIt: true,
    });
  }

  if (
    input.warnings.some(
      (warning) => warning.code === "ABSOLUTE_LAYOUT_DETECTED",
    )
  ) {
    requests.push({
      kind: "user-confirmation-request",
      severity: "low",
      message: "Beam inferred layout from absolute-positioned layers.",
      requestedEvidence: "Confirm whether the layout should be responsive.",
      canProceedWithoutIt: true,
    });
  }

  return requests;
}
