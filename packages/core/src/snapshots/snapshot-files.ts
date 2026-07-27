import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { beamSnapshotSchema, type BeamSnapshot } from "../contracts/index.js";
import { BeamFilesystemError } from "../errors.js";

export function absoluteSnapshotPath(
  projectBeamDir: string,
  relativePath: string,
): string {
  return join(projectBeamDir, "..", relativePath);
}

export async function writeSnapshotJson(
  projectBeamDir: string,
  relativePath: string,
  value: unknown,
): Promise<void> {
  const path = absoluteSnapshotPath(projectBeamDir, relativePath);

  try {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
  } catch {
    throw new BeamFilesystemError(
      "BEAM_CACHE_WRITE_FAILED",
      "Beam could not write local snapshot.",
    );
  }
}

export async function readSnapshotMetadata(
  projectBeamDir: string,
  relativePath: string,
): Promise<BeamSnapshot> {
  try {
    const content = await readFile(
      absoluteSnapshotPath(projectBeamDir, relativePath),
      "utf8",
    );
    return beamSnapshotSchema.parse(JSON.parse(content));
  } catch (error) {
    if (isNodeError(error, "ENOENT")) {
      throw new BeamFilesystemError(
        "BEAM_SNAPSHOT_NOT_FOUND",
        "Beam snapshot was not found.",
      );
    }

    throw new BeamFilesystemError(
      "BEAM_CACHE_READ_FAILED",
      "Beam could not read local snapshot.",
    );
  }
}

function isNodeError(
  error: unknown,
  code: string,
): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === code;
}
