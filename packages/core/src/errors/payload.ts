export type BeamErrorCode =
  | "BEAM_INVALID_INPUT"
  | "BEAM_INVALID_FIGMA_URL"
  | "BEAM_MISSING_CREDENTIALS"
  | "BEAM_AUTH_FAILED"
  | "BEAM_FIGMA_API_FAILED"
  | "BEAM_RATE_LIMITED"
  | "BEAM_CACHE_READ_FAILED"
  | "BEAM_CACHE_WRITE_FAILED"
  | "BEAM_SNAPSHOT_NOT_FOUND"
  | "BEAM_ASSET_EXPORT_FAILED"
  | "BEAM_COMPARE_FAILED"
  | "BEAM_COMPARE_THRESHOLD_FAILED"
  | "BEAM_MCP_CONFIG_FAILED"
  | "BEAM_UNSUPPORTED_CLIENT"
  | "BEAM_UNSUPPORTED_FLAG"
  | "BEAM_INTERNAL_ERROR";

export type BeamErrorPayload = {
  code: BeamErrorCode;
  message: string;
  exitCode: number;
  retryable: boolean;
  recoverable: boolean;
  details?: Record<string, unknown>;
  fix?: string;
};
