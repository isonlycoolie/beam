import { mkdir, appendFile } from "node:fs/promises";
import { join } from "node:path";
import { createBeamPaths } from "../config/paths.js";

export type LocalLogEntry = {
  timestamp?: string;
  command: string;
  requestId?: string;
  cacheStatus?: "hit" | "miss";
  endpoint?: string;
  warnings?: string[];
  errorCode?: string;
  details?: Record<string, unknown>;
};

export async function writeLocalLog(
  entry: LocalLogEntry,
  input: { cwd?: string; homeDir?: string; scope?: "project" | "user" } = {},
): Promise<string> {
  const paths = createBeamPaths(input);
  const logDir =
    input.scope === "user" ? join(paths.userBeamDir, "logs") : paths.logsDir;
  const path = join(logDir, "beam.log");
  await mkdir(logDir, { recursive: true });
  await appendFile(
    path,
    `${JSON.stringify(redactLogEntry({ timestamp: new Date().toISOString(), ...entry }))}\n`,
  );
  return path;
}

export function redactLogEntry<T>(value: T): T {
  return JSON.parse(redactString(JSON.stringify(value))) as T;
}

function redactString(value: string): string {
  return value
    .replace(/figd_[A-Za-z0-9_-]+/g, "figd_...redacted")
    .replace(/Bearer\s+[^"\\]+/gi, "Bearer ...redacted")
    .replace(/(https?:\/\/[^"\s?]+)\?[^"\s]+/g, "$1?...redacted");
}
