import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { chromium } from "playwright";
import { settlePage } from "../verify/capture.js";
import { judge, judgeWeight, type Finding, type ReviewFacts, type Weight } from "./judge.js";
import { REVIEW_SCRIPT } from "./review-script.js";

export type CraftReview = { id: string; url: string; findings: Finding[]; weight: Weight; reportDir: string; passed: boolean };

const ORDER = { high: 0, medium: 1, low: 2 } as const;

/** Reviews a running page for accessibility, layout, type, spacing, weight and generic-AI patterns. */
export async function reviewPage(input: { url: string; cwd: string; breakpoints?: number[] }): Promise<CraftReview> {
  const id = `craft_${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`;
  const reportDir = resolve(input.cwd, ".beam", "craft", id);
  await mkdir(reportDir, { recursive: true });
  const browser = await chromium.launch();
  const findings: Finding[] = [];
  let weight: Weight = { bytes: 0, requests: 0 };
  try {
    for (const [i, width] of (input.breakpoints ?? [1440, 390]).entries()) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const sizes: number[] = [];
      // Page weight is measured once, on the first (desktop) load, as the bytes transferred (compressed),
      // which is what a visitor actually downloads.
      if (i === 0)
        page.on("requestfinished", (request) => void request.sizes().then((s) => sizes.push(s.responseBodySize), () => undefined));
      try {
        await settlePage(page, input.url);
        findings.push(...judge(width, (await page.evaluate(REVIEW_SCRIPT)) as ReviewFacts));
        if (i === 0) weight = { bytes: sizes.reduce((a, b) => a + b, 0), requests: sizes.length };
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  findings.push(...judgeWeight(weight));
  findings.sort((a, b) => ORDER[a.severity] - ORDER[b.severity]);
  const review: CraftReview = { id, url: input.url, findings, weight, reportDir, passed: !findings.some((f) => f.severity === "high") };
  await writeFile(join(reportDir, "review.json"), `${JSON.stringify(review, null, 2)}\n`);
  await writeFile(join(reportDir, "review.md"), renderReview(review));
  return review;
}

export function renderReview(review: CraftReview): string {
  const lines = [`# Beam craft review: ${review.passed ? "PASS" : "FIX FIRST"}`, "", `Page: ${review.url}`, `Weight: ${Math.round(review.weight.bytes / 1024)} KB in ${review.weight.requests} requests`, ""];
  if (!review.findings.length) lines.push("No issues found.");
  for (const f of review.findings) lines.push(`- **${f.severity}** ${f.area}${f.width ? ` @${f.width}px` : ""}: ${f.message}. ${f.fix}`);
  return `${lines.join("\n")}\n`;
}
