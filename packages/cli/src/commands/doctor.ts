import { runDoctorChecks, type DoctorCheck } from "@beam/core";

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
  const lines = ["Beam doctor", ""];

  for (const check of checks) {
    lines.push(`${check.status.padEnd(4)}  ${check.label}`);
  }

  const credentialFix = checks.find(
    (check) => check.id === "figma-credentials" && check.fix,
  )?.fix;
  if (credentialFix) {
    lines.push("", credentialFix);
  }

  return `${lines.join("\n")}\n`;
}
