import { chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { BeamAuthError, BeamFilesystemError } from "../errors.js";
import {
  figmaCredentialsSchema,
  type FigmaCredentialsFile,
  type RedactedCredentialSummary,
} from "./credential-schema.js";
import { credentialsPath, isNodeError } from "./credential-paths.js";
import { redactAccessToken } from "./redaction.js";

export type { FigmaCredentialsFile, RedactedCredentialSummary } from "./credential-schema.js";
export { figmaCredentialsSchema } from "./credential-schema.js";
export { redactAccessToken } from "./redaction.js";

export async function loadFigmaCredentials(
  input: { homeDir?: string } = {},
): Promise<FigmaCredentialsFile["figma"]> {
  const path = credentialsPath(input);

  try {
    const content = await readFile(path, "utf8");
    return figmaCredentialsSchema.parse(JSON.parse(content)).figma;
  } catch (error) {
    if (isNodeError(error, "ENOENT")) {
      throw new BeamAuthError();
    }

    if (error instanceof BeamAuthError) {
      throw error;
    }

    throw new BeamFilesystemError(
      "BEAM_CACHE_READ_FAILED",
      "Beam could not read local credentials.",
    );
  }
}

export async function saveFigmaCredentials(
  accessToken: string,
  input: { homeDir?: string } = {},
): Promise<string> {
  const path = credentialsPath(input);
  const payload: FigmaCredentialsFile = {
    schemaVersion: "1.0",
    figma: {
      type: "personal_access_token",
      accessToken,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, {
      mode: 0o600,
    });
    await chmod(path, 0o600).catch(() => undefined);
    return path;
  } catch {
    throw new BeamFilesystemError(
      "BEAM_CACHE_WRITE_FAILED",
      "Beam could not write local credentials.",
    );
  }
}

export async function removeFigmaCredentials(
  input: { homeDir?: string } = {},
): Promise<void> {
  await rm(credentialsPath(input), { force: true });
}

export async function summarizeFigmaCredentials(
  input: { homeDir?: string } = {},
): Promise<RedactedCredentialSummary> {
  try {
    const credentials = await loadFigmaCredentials(input);
    return {
      provider: "figma",
      type: credentials.type,
      configured: true,
      redactedAccessToken: redactAccessToken(credentials.accessToken),
    };
  } catch (error) {
    if (error instanceof BeamAuthError) {
      return {
        provider: "figma",
        type: "personal_access_token",
        configured: false,
      };
    }

    throw error;
  }
}
