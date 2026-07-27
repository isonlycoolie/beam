import { access, mkdir, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { summarizeFigmaCredentials } from "../auth/credential-store.js";
import type { DoctorCheck } from "./types.js";

export function checkNodeVersion(version: string): DoctorCheck {
  const [major = 0, minor = 0] = version
    .replace(/^v/, "")
    .split(".")
    .map(Number);
  const pass = major > 22 || (major === 22 && minor >= 12);

  return {
    id: "node-version",
    label: "Node.js >= 22.12.0",
    status: pass ? "pass" : "fail",
    message: version,
    fix: pass ? undefined : "Install Node.js 22.12.0 or newer.",
  };
}

export async function checkPackageVersion(): Promise<DoctorCheck> {
  try {
    const packageJson = JSON.parse(
      await readFile(new URL("../../package.json", import.meta.url), "utf8"),
    ) as { version?: string };

    return {
      id: "beam-version",
      label: "Beam version detected",
      status: packageJson.version ? "pass" : "warn",
      message: packageJson.version ?? "Version field is missing.",
    };
  } catch {
    return {
      id: "beam-version",
      label: "Beam version detected",
      status: "warn",
      message: "Beam package version is unavailable.",
    };
  }
}

export async function checkDirectory(
  id: string,
  label: string,
  path: string,
): Promise<DoctorCheck> {
  try {
    await mkdir(path, { recursive: true });
    await access(path, constants.R_OK | constants.W_OK);
    return { id, label, status: "pass", message: path };
  } catch {
    return {
      id,
      label,
      status: "fail",
      message: `${path} is not readable and writable.`,
      fix: `Check filesystem permissions for ${path}.`,
    };
  }
}

export async function checkCredentials(input: {
  homeDir?: string;
}): Promise<DoctorCheck> {
  const summary = await summarizeFigmaCredentials(input);
  if (!summary.configured) {
    return {
      id: "figma-credentials",
      label: "Figma credentials",
      status: "warn",
      message: "Figma credentials not found.",
      fix: "Run beam login to configure Figma credentials.",
    };
  }

  return {
    id: "figma-credentials",
    label: "Figma credentials",
    status: "pass",
    message:
      `Configured ${summary.type} credential ${summary.redactedAccessToken ?? ""}`.trim(),
  };
}
