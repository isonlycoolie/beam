import { join, relative } from "node:path";
import { verifyBuild, type VerifyReport } from "@beam/core";
import { danger, heading, label, muted, path, success, warning } from "../terminal.js";

export type VerifyOptions = {
  reference: string;
  target: string;
  breakpoints?: string;
  threshold?: string;
  pixelsOnly?: boolean;
  json?: boolean;
  cwd?: string;
};

const pct = (score: number) => `${(score * 100).toFixed(1)}%`;

export function parseBreakpoints(value?: string): number[] | undefined {
  if (!value) return undefined;
  const widths = value.split(",").map((w) => Number(w.trim()));
  if (widths.some((w) => !Number.isInteger(w) || w < 200 || w > 4000))
    throw Object.assign(new Error("Breakpoints must be widths between 200 and 4000, for example 1440,768,390."), {
      payload: { code: "BEAM_INVALID_INPUT", message: "Breakpoints must be widths between 200 and 4000.", exitCode: 2, fix: "Use --breakpoints 1440,768,390." },
    });
  return widths;
}

export async function verifyCommand(options: VerifyOptions): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  const report = await verifyBuild({
    reference: options.reference,
    target: options.target,
    cwd,
    breakpoints: parseBreakpoints(options.breakpoints),
    threshold: options.threshold ? Number(options.threshold) : undefined,
    pixelsOnly: options.pixelsOnly,
  });
  process.stdout.write(options.json ? `${JSON.stringify(report, null, 2)}\n` : formatVerifyReport(report, cwd));
  // A failed check is a failed command, so CI and agent loops can stop on it.
  if (!report.passed) process.exitCode = 1;
}

export function formatVerifyReport(report: VerifyReport, cwd: string): string {
  const lines = [heading("Beam verify"), ""];
  for (const bp of report.breakpoints) {
    const status = bp.passed ? success("PASS") : danger("FAIL");
    lines.push(`${status}  ${bp.width}px  ${pct(bp.score)} of pixels match`);
    for (const s of bp.sections.filter((s) => s.score < report.threshold))
      lines.push(`      ${warning(pct(s.score))} ${s.label}`);
    if (bp.elements?.missing.length) lines.push(`      ${warning(`${bp.elements.missing.length} elements missing`)}`);
    const high = bp.elements?.deltas.filter((d) => d.severity === "high").length ?? 0;
    if (high) lines.push(`      ${warning(`${high} colour, font or layout values differ`)}`);
  }
  lines.push(
    "",
    label("Brief", path(relative(cwd, join(report.reportDir, "report.md")) || report.reportDir)),
    muted(report.passed ? `Every section reached ${pct(report.threshold)}.` : "Open the brief for the exact values to fix, then run verify again."),
  );
  return `${lines.join("\n")}\n`;
}
