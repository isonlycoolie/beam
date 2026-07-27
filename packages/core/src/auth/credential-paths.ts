import { join } from "node:path";
import { createBeamPaths } from "../config/paths.js";

export function credentialsPath(input: { homeDir?: string }): string {
  return join(
    createBeamPaths({ homeDir: input.homeDir }).userBeamDir,
    "credentials.json",
  );
}

export function isNodeError(
  error: unknown,
  code: string,
): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === code;
}
