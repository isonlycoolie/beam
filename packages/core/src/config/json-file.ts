import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { z } from "zod";
import { BeamFilesystemError } from "../errors.js";

export async function readOptionalJson<T>(
  path: string,
  schema: z.ZodType<T>,
): Promise<T | undefined> {
  try {
    const content = await readFile(path, "utf8");
    return schema.parse(JSON.parse(content));
  } catch (error) {
    if (isNodeError(error, "ENOENT")) {
      return undefined;
    }

    throw new BeamFilesystemError(
      "BEAM_CACHE_READ_FAILED",
      `Beam could not read local config at ${path}.`,
    );
  }
}

export async function writeJson(path: string, value: unknown): Promise<void> {
  try {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, {
      mode: 0o600,
    });
  } catch {
    throw new BeamFilesystemError(
      "BEAM_CACHE_WRITE_FAILED",
      `Beam could not write local config at ${path}.`,
    );
  }
}

function isNodeError(
  error: unknown,
  code: string,
): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === code;
}
