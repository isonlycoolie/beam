import { BeamError } from "./base.js";

export class BeamInvalidInputError extends BeamError {
  constructor(message: string, details?: Record<string, unknown>) {
    super({
      code: "BEAM_INVALID_FIGMA_URL",
      message,
      exitCode: 2,
      retryable: false,
      recoverable: true,
      details,
      fix: "Paste a Figma file or frame URL.",
    });
    this.name = "BeamInvalidInputError";
  }
}

export class BeamAuthError extends BeamError {
  constructor(message = "Figma credentials were not found.") {
    super({
      code: "BEAM_MISSING_CREDENTIALS",
      message,
      exitCode: 3,
      retryable: false,
      recoverable: true,
      fix: "Run beam login.",
    });
    this.name = "BeamAuthError";
  }
}
