import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export function extractImageUrls(value: unknown): Record<string, string> {
  if (isRecord(value) && isRecord(value["images"])) {
    return Object.fromEntries(
      Object.entries(value["images"]).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  }

  return {};
}

export async function writeAssetFile(
  path: string,
  bytes: Uint8Array,
): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, bytes, { flag: "wx" }).catch(async (error: unknown) => {
    if (isNodeError(error, "EEXIST")) {
      return;
    }
    throw error;
  });
}

export function safeName(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-");
}

export function normalizeOutDir(value: string): string {
  return value.replaceAll("\\", "/").replace(/\/$/, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNodeError(
  error: unknown,
  code: string,
): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === code;
}
