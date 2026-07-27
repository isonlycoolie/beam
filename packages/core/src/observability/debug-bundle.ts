import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createBeamPaths } from "../config/paths.js";
import { loadBeamConfig } from "../config/config-store.js";
import { SnapshotStore } from "../snapshots/snapshot-store.js";
import { redactLogEntry } from "./local-logs.js";

export async function createDebugBundle(
  input: {
    cwd?: string;
    homeDir?: string;
    outDir?: string;
    includeRaw?: boolean;
  } = {},
) {
  const paths = createBeamPaths(input);
  const id = `debug_${Date.now()}`;
  const root = join(paths.cwd, input.outDir ?? ".beam/debug", id);
  await mkdir(root, { recursive: true });

  const { config } = await loadBeamConfig(input);
  await writeJson(join(root, "config.redacted.json"), redactLogEntry(config));
  await writeJson(join(root, "environment.json"), {
    node: process.version,
    platform: process.platform,
    beamVersion: "0.1.0",
  });
  await writeJson(join(root, "snapshots", "index.json"), {
    snapshots: await new SnapshotStore({ cwd: input.cwd }).list(),
  });
  await writeText(
    join(root, "logs", "recent.log"),
    await recentLog(paths.logsDir),
  );

  const manifest = {
    schemaVersion: "1.0",
    id,
    createdAt: new Date().toISOString(),
    includesRaw: input.includeRaw === true,
    files: [
      "config.redacted.json",
      "logs/recent.log",
      "snapshots/index.json",
      "environment.json",
    ],
    redactions: ["credentials", "signedImageUrls", "authorizationHeaders"],
  };
  await writeJson(join(root, "manifest.json"), manifest);
  return { path: root, manifest };
}

async function recentLog(logDir: string): Promise<string> {
  try {
    const names = await readdir(logDir);
    if (!names.includes("beam.log")) return "";
    return redactLogEntry(await readFile(join(logDir, "beam.log"), "utf8"));
  } catch {
    return "";
  }
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await writeText(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeText(path: string, value: string): Promise<void> {
  await mkdir(join(path, ".."), { recursive: true });
  await writeFile(path, value);
}
