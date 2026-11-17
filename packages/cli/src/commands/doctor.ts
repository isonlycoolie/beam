import { runDoctorChecks, type DoctorCheck } from "@beam/core";
import { heading, icons, muted, section } from "../terminal.js";
import { BEAM_VERSION } from "../version.js";

export async function doctorCommand(
  options: { json?: boolean } = {},
): Promise<void> {
  const result = await runDoctorChecks({
    cwd: process.cwd(),
    version: BEAM_VERSION,
  });

  if (options.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  process.stdout.write(formatDoctorChecks(result.checks));
}

export function formatDoctorChecks(checks: DoctorCheck[]): string {
  const lines = [heading("Beam doctor"), ""];

  for (const check of checks) {
    lines.push(`${statusIcon(check.status)}  ${check.label}  ${muted(check.message)}`);
  }

  const fixes = checks.filter((check) => check.status !== "pass" && check.fix);
  if (fixes.length > 0) {
    lines.push("", section("Next steps"));
    for (const check of fixes) lines.push(`${muted("-")} ${check.fix}`);
  }

  return `${lines.join("\n")}\n`;
}

function statusIcon(status: DoctorCheck["status"]): string {
  if (status === "pass") return icons.pass;
  if (status === "warn") return icons.warn;
  return icons.fail;
}
