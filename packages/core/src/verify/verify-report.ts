import type { VerifyReport } from "./verify-service.js";

const pct = (score: number) => `${(score * 100).toFixed(1)}%`;

/** A short brief an agent can act on: what is off, where, and the exact value to use instead. */
export function renderVerifyMarkdown(report: VerifyReport, limit = 40): string {
  const lines = [
    `# Beam verify: ${report.passed ? "PASS" : "FAIL"}`,
    "",
    `Reference: ${report.reference}`,
    `Target: ${report.target}`,
    `Every section must reach ${pct(report.threshold)}.`,
  ];
  for (const bp of report.breakpoints) {
    lines.push("", `## ${bp.width}px: ${bp.passed ? "pass" : "fail"} (${pct(bp.score)} of pixels match)`);
    const [rw, rh] = bp.size.reference;
    const [tw, th] = bp.size.target;
    if (rw !== tw || rh !== th) lines.push(`- Page size differs: reference ${rw}x${rh}, build ${tw}x${th}.`);
    const weak = bp.sections.filter((s) => s.score < report.threshold);
    if (weak.length) {
      lines.push("", "Sections below the threshold:");
      for (const s of weak) lines.push(`- ${s.label} (y ${s.top} to ${s.top + s.height}): ${pct(s.score)}`);
    }
    if (bp.elements) {
      if (bp.elements.missing.length) {
        lines.push("", `Missing from the build (${bp.elements.missing.length}):`);
        for (const m of bp.elements.missing.slice(0, limit)) lines.push(`- <${m.tag}> ${m.text ? `"${m.text}"` : m.path}`);
      }
      if (bp.elements.deltas.length) {
        lines.push("", `Values to fix (${bp.elements.deltas.length}, most important first):`);
        for (const d of bp.elements.deltas.slice(0, limit))
          lines.push(`- <${d.tag}> ${d.text ? `"${d.text}"` : d.path}: ${d.property} should be ${d.expected}, is ${d.actual}`);
      }
    }
    lines.push("", `Images: ${bp.files.reference}, ${bp.files.target}, ${bp.files.diff}`);
  }
  return `${lines.join("\n")}\n`;
}
