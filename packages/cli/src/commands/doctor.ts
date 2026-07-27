import { runDoctorChecks, type DoctorCheck } from "@beam/core";
import { heading, icons, muted, section } from "../terminal.js";

export async function doctorCommand(
  options: { json?: boolean } = {},
): Promise<void> {
  const result = await runDoctorChecks({ cwd: process.cwd() });

  if (options.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  process.stdout.write(formatDoctorChecks(result.checks));
}

export function formatDoctorChecks(checks: DoctorCheck[]): string {
  const lines = [heading("Beam doctor"), ""];

  for (const check of checks) {
    lines.push(`${statusIcon(check.status)}  ${check.label}`);
  }

  const credentialFix = checks.find(
    (check) => check.id === "figma-credentials" && check.fix,
  )?.fix;
  if (credentialFix) {
    lines.push("", section("Next step"), muted(credentialFix));
  }

  return `${lines.join("\n")}\n`;
}

function statusIcon(status: DoctorCheck["status"]): string {
  if (status === "pass") return icons.pass;
  if (status === "warn") return icons.warn;
  return icons.fail;
}
