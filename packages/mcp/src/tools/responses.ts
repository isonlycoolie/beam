import { BeamError } from "@beam/core";

export function jsonContent(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

export function toolError(error: unknown) {
  if (error instanceof BeamError) {
    return jsonContent({ error: error.payload });
  }

  return jsonContent({
    error: {
      code: "BEAM_INTERNAL_ERROR",
      message: "Beam MCP tool failed.",
      exitCode: 1,
      retryable: false,
      recoverable: false,
    },
  });
}
