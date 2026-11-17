import { join, relative } from "node:path";
import { reviewPage, type CraftReview } from "@beam/core";
import { danger, heading, label, muted, path, success, warning } from "../terminal.js";
import { parseBreakpoints } from "./verify.js";

export async function craftReviewCommand(url: string, options: { breakpoints?: string; json?: boolean; cwd?: string } = {}): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  const review = await reviewPage({ url, cwd, breakpoints: parseBreakpoints(options.breakpoints) });
  process.stdout.write(options.json ? `${JSON.stringify(review, null, 2)}\n` : formatCraftReview(review, cwd));
  if (!review.passed) process.exitCode = 1;
}

export function formatCraftReview(review: CraftReview, cwd: string): string {
  const tag = { high: danger("HIGH"), medium: warning("MED "), low: muted("LOW ") } as const;
  const lines = [heading("Beam craft review"), ""];
  for (const f of review.findings.slice(0, 25)) lines.push(`${tag[f.severity]}  ${f.message}${f.width ? muted(` @${f.width}px`) : ""}`);
  if (review.findings.length > 25) lines.push(muted(`...and ${review.findings.length - 25} more in the report`));
  if (!review.findings.length) lines.push(success("No issues found."));
  lines.push("", label("Weight", `${Math.round(review.weight.bytes / 1024)} KB in ${review.weight.requests} requests`), label("Report", path(relative(cwd, join(review.reportDir, "review.md")))));
  return `${lines.join("\n")}\n`;
}
