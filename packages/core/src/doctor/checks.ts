import { access, mkdir } from "node:fs/promises";
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

export async function checkPackageVersion(
  version?: string,
): Promise<DoctorCheck> {
  if (version) {
    return { id: "beam-version", label: "Beam version", status: "pass", message: version };
  }
  return {
    id: "beam-version",
    label: "Beam version",
    status: "warn",
    message: "Beam package version is unavailable.",
    fix: "Reinstall Beam with npm install -g usebeam or run it with npx usebeam.",
  };
}

/** The screenshot-based tools (compare, verify, clone) need Playwright's Chromium. */
export async function checkBrowser(): Promise<DoctorCheck> {
  const base = { id: "browser", label: "Chromium for screenshots" };
  try {
    const { chromium } = await import("playwright");
    const executable = chromium.executablePath();
    await access(executable, constants.X_OK);
    return { ...base, status: "pass", message: executable };
  } catch {
    return {
      ...base,
      status: "warn",
      message: "Chromium is not installed, so compare, verify and clone cannot take screenshots.",
      fix: "Run beam setup browser (downloads about 150 MB once).",
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
