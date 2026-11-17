import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { PNG } from "pngjs";
import { openCaptureSession } from "./capture.js";
import { diffElements, type ElementDiff } from "./element-diff.js";
import { diffPngs, type SectionScore } from "./pixel-diff.js";
import { renderVerifyMarkdown } from "./verify-report.js";

export type BreakpointResult = {
  width: number;
  score: number;
  size: { reference: [number, number]; target: [number, number] };
  sections: SectionScore[];
  elements?: ElementDiff;
  files: { reference: string; target: string; diff: string };
  passed: boolean;
};

export type VerifyReport = {
  schemaVersion: "1.0";
  id: string;
  reference: string;
  target: string;
  threshold: number;
  passed: boolean;
  breakpoints: BreakpointResult[];
  reportDir: string;
};

export type VerifyInput = {
  reference: string;
  target: string;
  cwd: string;
  breakpoints?: number[];
  threshold?: number;
  /** Count only pixels; skip element pairing (useful for design PNGs or canvas-heavy pages). */
  pixelsOnly?: boolean;
};

const isUrl = (value: string) => /^https?:\/\//i.test(value) || value.startsWith("file:");

/**
 * Proves a build matches its source. A breakpoint passes only when every section reaches the threshold
 * and, for URL references, no element is missing and no colour, font or large layout delta remains.
 */
export async function verifyBuild(input: VerifyInput): Promise<VerifyReport> {
  const threshold = input.threshold ?? 0.98;
  const id = `verify_${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`;
  const reportDir = resolve(input.cwd, ".beam", "verify", id);
  await mkdir(reportDir, { recursive: true });

  const referencePng = isUrl(input.reference) ? undefined : await readFile(resolve(input.cwd, input.reference));
  const widths = referencePng ? [PNG.sync.read(referencePng).width] : (input.breakpoints ?? [1440, 768, 390]);
  const session = await openCaptureSession();
  const breakpoints: BreakpointResult[] = [];
  try {
    for (const width of widths) {
      const target = await session.capture(input.target, width);
      const reference = referencePng ? undefined : await session.capture(input.reference, width);
      const pixels = diffPngs({ reference: referencePng ?? reference!.png, target: target.png, sections: reference?.sections });
      const elements = reference && !input.pixelsOnly ? diffElements(reference.elements, target.elements) : undefined;
      const files = { reference: `${width}-reference.png`, target: `${width}-target.png`, diff: `${width}-diff.png` };
      await writeFile(join(reportDir, files.reference), referencePng ?? reference!.png);
      await writeFile(join(reportDir, files.target), target.png);
      await writeFile(join(reportDir, files.diff), pixels.diffPng);
      const elementsClean = !elements || (elements.missing.length === 0 && !elements.deltas.some((d) => d.severity === "high"));
      breakpoints.push({
        width,
        score: pixels.score,
        size: pixels.size,
        sections: pixels.sections,
        elements,
        files,
        passed: pixels.sections.every((s) => s.score >= threshold) && elementsClean,
      });
    }
  } finally {
    await session.close();
  }

  const report: VerifyReport = {
    schemaVersion: "1.0",
    id,
    reference: input.reference,
    target: input.target,
    threshold,
    passed: breakpoints.every((b) => b.passed),
    breakpoints,
    reportDir,
  };
  await writeFile(join(reportDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(join(reportDir, "report.md"), renderVerifyMarkdown(report));
  return report;
}
