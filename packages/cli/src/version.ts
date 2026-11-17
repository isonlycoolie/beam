import { readFileSync } from "node:fs";

/** Reads the version from the CLI's package.json (src/ and the bundled dist/ both sit one level below it). */
function readVersion(): string | undefined {
  try {
    const raw = readFileSync(new URL("../package.json", import.meta.url), "utf8");
    return (JSON.parse(raw) as { version?: string }).version;
  } catch {
    return undefined;
  }
}

export const BEAM_VERSION = readVersion() ?? "0.0.0";
