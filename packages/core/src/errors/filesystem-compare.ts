import { BeamError } from "./base.js";

export class BeamFilesystemError extends BeamError {
  constructor(
    code:
      | "BEAM_CACHE_READ_FAILED"
      | "BEAM_CACHE_WRITE_FAILED"
      | "BEAM_SNAPSHOT_NOT_FOUND",
    message: string,
  ) {
    super({
      code,
      message,
      exitCode: 6,
      retryable: false,
      recoverable: true,
    });
    this.name = "BeamFilesystemError";
  }
}

export class BeamCompareError extends BeamError {
  constructor(
    message = "Beam compare failed.",
    details?: Record<string, unknown>,
  ) {
    super({
      code: "BEAM_COMPARE_FAILED",
      message,
      exitCode: 1,
      retryable: true,
      recoverable: true,
      details,
    });
    this.name = "BeamCompareError";
  }
}
