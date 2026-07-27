import { homedir } from "node:os";
import { resolve } from "node:path";

export type BeamPaths = {
  cwd: string;
  homeDir: string;
  userBeamDir: string;
  projectBeamDir: string;
  cacheDir: string;
  snapshotsDir: string;
  logsDir: string;
};

export function createBeamPaths(
  input: { cwd?: string; homeDir?: string } = {},
): BeamPaths {
  const cwd = resolve(input.cwd ?? process.cwd());
  const homeDir = resolve(input.homeDir ?? homedir());
  const userBeamDir = resolve(homeDir, ".beam");
  const projectBeamDir = resolve(cwd, ".beam");

  return {
    cwd,
    homeDir,
    userBeamDir,
    projectBeamDir,
    cacheDir: resolve(projectBeamDir, "cache"),
    snapshotsDir: resolve(projectBeamDir, "snapshots"),
    logsDir: resolve(projectBeamDir, "logs"),
  };
}
