import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  stat,
  writeFile,
} from "node:fs/promises";
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

export async function listSnapshotMetadata(
  projectBeamDir: string,
): Promise<BeamSnapshot[]> {
  const dir = absoluteSnapshotPath(projectBeamDir, ".beam/snapshots");

  try {
    const names = await readdir(dir);
    const snapshots = await Promise.all(
      names
        .filter((name) => name.endsWith(".json"))
        .map((name) =>
          readSnapshotMetadata(projectBeamDir, `.beam/snapshots/${name}`),
        ),
    );
    return snapshots.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    if (isNodeError(error, "ENOENT")) return [];
    throw new BeamFilesystemError(
      "BEAM_CACHE_READ_FAILED",
      "Beam could not list local snapshots.",
    );
  }
}

export async function snapshotPathExists(
  projectBeamDir: string,
  relativePath?: string,
): Promise<boolean> {
  if (!relativePath) return false;
  try {
    await stat(absoluteSnapshotPath(projectBeamDir, relativePath));
    return true;
  } catch {
    return false;
  }
}

export async function copySnapshotFile(
  projectBeamDir: string,
  fromRelativePath: string | undefined,
  toPath: string,
): Promise<string | undefined> {
  if (!fromRelativePath) return undefined;
  try {
    await mkdir(dirname(toPath), { recursive: true });
    await copyFile(
      absoluteSnapshotPath(projectBeamDir, fromRelativePath),
      toPath,
    );
    return toPath;
  } catch {
    throw new BeamFilesystemError(
      "BEAM_SNAPSHOT_NOT_FOUND",
      "Beam snapshot artifact was not found.",
    );
  }
}

function isNodeError(
  error: unknown,
  code: string,
): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === code;
}
