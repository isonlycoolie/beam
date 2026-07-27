import { BeamError } from "./base.js";

export class BeamFigmaApiError extends BeamError {
  constructor(
    message = "Figma API request failed.",
    details?: Record<string, unknown>,
  ) {
    super({
      code: "BEAM_FIGMA_API_FAILED",
      message,
      exitCode: 4,
      retryable: true,
      recoverable: true,
      details,
    });
    this.name = "BeamFigmaApiError";
  }
}

export class BeamRateLimitError extends BeamError {
  constructor(
    message = "Figma rate limit reached.",
    details?: Record<string, unknown>,
  ) {
    super({
      code: "BEAM_RATE_LIMITED",
      message,
      exitCode: 5,
      retryable: true,
      recoverable: true,
      details,
    });
    this.name = "BeamRateLimitError";
  }
}
