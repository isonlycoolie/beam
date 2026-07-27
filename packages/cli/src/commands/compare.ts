import { compareDesignToUrl, type CompareResult } from "@beam/core";

export async function compareCommand(
  figmaUrl: string,
  targetUrl: string,
  options: {
    threshold?: string;
    out?: string;
    refresh?: boolean;
    json?: boolean;
  },
): Promise<void> {
  const result = await compareDesignToUrl({
    figmaUrl,
    targetUrl,
    cwd: process.cwd(),
    threshold: parseThreshold(options.threshold),
    outDir: options.out,
    refresh: options.refresh,
  });

  process.stdout.write(
    options.json
      ? `${JSON.stringify(result, null, 2)}\n`
      : formatCompareResult(result),
  );

  if (result.passed === false) {
    process.exitCode = 8;
  }
}

export function formatCompareResult(result: CompareResult): string {
  const lines = [
    "Beam compare",
    "",
    `Score: ${result.score}`,
    `Threshold: ${String(result.threshold ?? 0.95)}`,
    `Result: ${result.passed === false ? "fail" : "pass"}`,
    `Target: ${result.artifacts?.targetImage ?? "not captured"}`,
    `Diff: ${result.artifacts?.diffImage ?? "not written"}`,
  ];

  if (result.differences.length > 0) {
    lines.push("", "Differences:");
    lines.push(...result.differences.map((item) => `- ${item.message}`));
  }

  return `${lines.join("\n")}\n`;
}

function parseThreshold(value: string | undefined): number {
  if (value === undefined) {
    return 0.95;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    throw new Error("Threshold must be between 0 and 1.");
  }

  return parsed;
}
