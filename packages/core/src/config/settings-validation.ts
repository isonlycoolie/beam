import { isAbsolute, relative, resolve } from "node:path";
import { BeamInvalidInputError } from "../errors.js";
import { createBeamPaths } from "./paths.js";

export type FreeSettingKey =
  "defaultContextMode" | "assetsDir" | "compareDir" | "cache.maxAgeMinutes";

export const settingKeys: FreeSettingKey[] = [
  "defaultContextMode",
  "assetsDir",
  "compareDir",
  "cache.maxAgeMinutes",
];

export function parseSettingValue(
  key: FreeSettingKey,
  value: string,
  input: { cwd?: string },
) {
  if (key === "defaultContextMode") {
    if (!["summary", "standard", "full", "raw"].includes(value)) {
      throw new BeamInvalidInputError("Invalid context mode.");
    }
    return value;
  }

  if (key === "cache.maxAgeMinutes") {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 0) {
      throw new BeamInvalidInputError(
        "cache.maxAgeMinutes must be nonnegative.",
      );
    }
    return parsed;
  }

  assertProjectPath(value, input.cwd);
  return value;
}

export function assertSettingKey(key: string): asserts key is FreeSettingKey {
  if (!settingKeys.includes(key as FreeSettingKey)) {
    throw new BeamInvalidInputError(`Unsupported setting key: ${key}`);
  }
}

function assertProjectPath(value: string, cwd = process.cwd()): void {
  if (!isAbsolute(value)) return;
  const rel = relative(createBeamPaths({ cwd }).cwd, resolve(value));
  if (rel.startsWith("..") || isAbsolute(rel)) {
    throw new BeamInvalidInputError(
      "Absolute paths must stay inside the project.",
    );
  }
}
