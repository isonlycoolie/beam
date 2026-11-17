import { createBeamPaths } from "../config/paths.js";
import {
  checkBrowser,
  checkCredentials,
  checkDirectory,
  checkNodeVersion,
  checkPackageVersion,
} from "./checks.js";
import type { DoctorCheck } from "./types.js";
export type { DoctorCheck, DoctorCheckStatus } from "./types.js";

export async function runDoctorChecks(input: {
  cwd: string;
  homeDir?: string;
  version?: string;
  skipBrowser?: boolean;
}): Promise<{ checks: DoctorCheck[] }> {
  const paths = createBeamPaths(input);
  const checks: DoctorCheck[] = [];

  checks.push(checkNodeVersion(process.version));
  checks.push(await checkPackageVersion(input.version));
  checks.push(
    await checkDirectory(
      "user-beam-dir",
      "User Beam directory",
      paths.userBeamDir,
    ),
  );
  checks.push(
    await checkDirectory(
      "project-beam-dir",
      "Project Beam directory",
      paths.projectBeamDir,
    ),
  );
  checks.push(await checkCredentials(input));
  checks.push(
    await checkDirectory(
      "cache-dir",
      "Project cache directory",
      paths.cacheDir,
    ),
  );

  if (!input.skipBrowser) checks.push(await checkBrowser());

  return { checks };
}
