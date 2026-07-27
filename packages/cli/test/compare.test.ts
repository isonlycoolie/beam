import { describe, expect, it } from "vitest";
import { formatCompareResult } from "../src/index.js";

describe("compare command", () => {
  it("formats compare output", () => {
    const output = stripAnsi(
      formatCompareResult({
        schemaVersion: "1.0",
        id: "compare_test",
        figmaSnapshotId: "snapshot_test",
        targetUrl: "http://localhost:3000",
        createdAt: "2026-07-19T00:00:00.000Z",
        threshold: 0.95,
        score: 0.9,
        passed: false,
        artifacts: {
          figmaImage: ".beam/cache/images/frame.png",
          targetImage: ".beam/cache/compare/target.png",
          diffImage: ".beam/cache/compare/diff.png",
        },
        differences: [
          { type: "pixels", severity: "high", message: "Pixels differ." },
        ],
      }),
    );

    expect(output).toContain("Beam compare");
    expect(output).toContain("Result: fail");
    expect(output).toContain("Pixels differ.");
  });
});

function stripAnsi(value: string): string {
  return value.replace(/\u001b\[[0-9;]*m/g, "");
}
