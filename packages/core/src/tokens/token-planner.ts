import type {
  BeamWarning,
  ContextMode,
  ImplementationBrief,
} from "../contracts/index.js";

export type TokenPlanResult = {
  brief: ImplementationBrief;
  estimatedTokens: number;
  warnings: BeamWarning[];
};

export function planImplementationBrief(
  brief: ImplementationBrief,
  mode: ContextMode = "standard",
): TokenPlanResult {
  const plannedBrief = cloneBrief(brief);
  const warnings: BeamWarning[] = [];

  if (mode === "summary") {
    plannedBrief.tokens = {
      colors: brief.tokens["colors"],
      typography: brief.tokens["typography"],
    };
    plannedBrief.implementationNotes = brief.implementationNotes.slice(0, 2);
    warnings.push(omittedWarning("summary"));
  }

  if (mode === "standard") {
    plannedBrief.tokens = {
      colors: brief.tokens["colors"],
      typography: brief.tokens["typography"],
      radii: brief.tokens["radii"],
      text: brief.tokens["text"],
    };
  }

  if (mode === "raw") {
    warnings.push({
      code: "RAW_MODE_SELECTED",
      severity: "medium",
      message: "Raw mode may produce a large agent context.",
    });
  }

  const estimatedTokens = Math.ceil(JSON.stringify(plannedBrief).length / 4);
  if (estimatedTokens > limitForMode(mode)) {
    warnings.push({
      code: "TOO_MANY_NODES_FOR_MODE",
      severity: "medium",
      message: `Estimated context exceeds the recommended ${mode} mode budget.`,
    });
  }

  return { brief: plannedBrief, estimatedTokens, warnings };
}

function cloneBrief(brief: ImplementationBrief): ImplementationBrief {
  return JSON.parse(JSON.stringify(brief)) as ImplementationBrief;
}

function omittedWarning(mode: ContextMode): BeamWarning {
  return {
    code: "LOW_VALUE_DATA_OMITTED",
    severity: "low",
    message: `Low-value data was omitted for ${mode} mode.`,
  };
}

function limitForMode(mode: ContextMode): number {
  return {
    summary: 2_000,
    standard: 18_000,
    full: 60_000,
    raw: 120_000,
  }[mode];
}
