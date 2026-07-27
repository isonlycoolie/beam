import { createBeamPaths } from "../config/paths.js";
import {
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
}): Promise<{ checks: DoctorCheck[] }> {
  const paths = createBeamPaths(input);
  const checks: DoctorCheck[] = [];

  checks.push(checkNodeVersion(process.version));
  checks.push(await checkPackageVersion());
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

  return { checks };
}
